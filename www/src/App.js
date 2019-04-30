import React from "react";
import axios from "axios";

import gitInfo from "./static/gitInfo.json";
import "./App.css";
import GitInfo from "./GitInfo";
import Timetable from "./Timetable";

const url = new URL(window.location.href);
console.log("Use DEBUG query parameter to use local data (not live data).");
const DEBUG = url.searchParams.get("DEBUG") !== "false";
const localDataSource = url.searchParams.get("localDataSource");

function getLocalDataSourceURL(localDataSourceName) {
  switch (localDataSource) {
    case "ok": return "./test/laneSwimming.json";
    case "singleDataSourceError": return "./test/laneSwimming.s10error.json";
    case "error": return "./test/laneSwimming.error.json";
    case "20190427": return "./test/20190427-225524_laneSwimming.json";
    default: return null;
  }
}

function getDataSourceURL(localDataSource) {
  if (DEBUG && localDataSource) {
    const url = getLocalDataSourceURL(localDataSource);
    if (url) {
      return url;
    }
  }
  return "https://c1dz9rg5cd.execute-api.eu-west-2.amazonaws.com/prod/laneSwimmingData";
}

function reducer(state, action) {
  const setSingleState = (name, value) => {
    return {
      ...state,
      [name]: value,
    };
  };
  switch (action.type) {
    case "set": return setSingleState(action.field.name, action.field.value);
    case "reduce": return {
      ...state,
      [action.field.name]: action.reducer(state[action.field.name]),
    };
    case "changeTimetableVisibility": return setSingleState("visible", {
      ...state.visible,
      [action.key]: action.visible,
    });
  }
  return state;
}


async function fetch(name, uri, dispatch) {
  const stateName = "fetch." + name;
  const reduce = (name, reducer) => dispatch({ type: "reduce", field: { name }, reducer });
  reduce(stateName, () => ({
    // initial state. empty object apart from loading
    loading: true,
  }));
  try {
    const response = await axios.get(uri);
    reduce(stateName, (state) => ({
      ...state,
      data: response.data,
    }));
    return response;
  } catch (err) {
    err.uri = uri;
    reduce(stateName, (state) => ({
      ...state,
      error: err,
    }));
    throw err;
  } finally {
    reduce(stateName, (state) => ({
      ...state,
      loading: null,
    }));
  }
}


function Error({
  title,
  error,
}) {
  const errorInfo = error.statusCode
    ? [
      error.statusCode,
      error.options && error.options.uri,
    ]
    : error;

  return (
    <div>
      <h1>{title}</h1>
      <div>
        {
          (typeof errorInfo === "string")
            ? error
            : <pre>{JSON.stringify(error, null, 2)}</pre>
        }
      </div>
    </div>
  );
}


function TimetableWithHeader({
  name,
  timetable,
  vendor,
  visible = true,
  setVisible,
}) {
  name = name || "Regular Timetable";
  vendor = vendor || "Unknown vendor";

  const onClickHeading = (e) => {
    e.preventDefault();
    setVisible && setVisible(!visible);
  };

  return (
    <div>
      <h1>
        <a
          href="#"
          onClick={onClickHeading}
        >
          {name} ({vendor})
        </a>
      </h1>
      {visible && (
        <Timetable timetable={timetable} />
      )}
    </div>
  );
}


const initialState = {};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const url = getDataSourceURL(localDataSource);

  React.useEffect(() => {
    (async () => {
      const cacheBustUrl = url + "?" + new Date().getTime();
      try {
        const response = await fetch("timetables", cacheBustUrl, dispatch)
        dispatch({ type: "set", field: { name: "timetables", value: response.data } });
      } catch (err) {
        // ignore - handled by fetch
      }
    })();
  }, [url]);

  const renderTimetables = (state) => {
    if (!state) {
      return "No state!";
    }

    console.log(state);

    const { timetables, "fetch.timetables": fetchTimetables } = state;

    return (
      <>
        {fetchTimetables && fetchTimetables.loading && (
          <div style={{ textAlign: "center" }}>
            <p>Loading Timetables...</p>
            <img src={`${process.env.PUBLIC_URL}/loader.gif`} />
          </div>
        )}

        {fetchTimetables && fetchTimetables.error && (
          <Error
            title="Fetch Timetables Error"
            error={fetchTimetables.error}
          />
        )}

        {
          timetables && timetables.reduce((result, { vendor, timetables }, vendorIdx) => {
            timetables.forEach(({ name, timetable, error }, timetableIdx) => {
              if (error) {
                result.push(
                  <Error
                    title={`${name} (${vendor || "Unknown vendor"})`}
                    error={error}
                    key={result.length}
                  />
                );
              } else {
                const key = `timetable[${vendorIdx}][${timetableIdx}]`;
                const visible = Boolean(state.visible && state.visible[key]);
                const setVisible = (visible) => dispatch({ type: "changeTimetableVisibility", key, visible });
                result.push(
                  <TimetableWithHeader
                    name={name}
                    timetable={timetable}
                    vendor={vendor}
                    key={key}
                    visible={visible}
                    setVisible={setVisible}
                  />
                );
              }
            });
            return result;
          }, [])
        }
      </>
    );
  };

  return (
    <div className="App">
      {renderTimetables(state)}
      <hr />
      <GitInfo gitInfo={gitInfo} />
    </div>
  );
}

export default App;
