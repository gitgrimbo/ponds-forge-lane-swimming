import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import gitInfo from "./static/gitInfo.json";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const url = new URL(window.location.href);
console.log("Use DEBUG query parameter to use local data (not live data).");
const DEBUG = url.searchParams.get("DEBUG") !== "false";
const localDataSource = url.searchParams.get("localDataSource");

class Item extends Component {
  render() {
    const { item } = this.props;
    const alterations = [];
    if (item.alterations && item.alterations.length > 0) {
      item.alterations.forEach((alteration, i) => {
        alterations.push(<br key={"br" + i} />);
        const date = alteration.date || "No date";
        alterations.push(<span key={"alteration-" + i} style={{ color: "red" }}>{date + ", " + alteration.message}</span>);
      });
    }
    return (
      <div >
        <div>{item.description}</div>
        <div>{item.room}</div>
        <div>{alterations}</div>
      </div>
    );
  }
}

function dayRows(day) {
  const dayName = isNaN(day.day) ? day.day : DAYS[day.day];
  const item0 = day.items[0];
  if (!item0) {
    return null;
  }
  const dayNameCell = (i) => (i === 0) ? <td rowSpan={day.items.length}>{dayName}</td> : null;
  return day.items.map((item, i) => (
    <tr key={i}>
      {dayNameCell(i)}
      <td>{item.startTime}</td>
      <td>{item.endTime}</td>
      <td><Item item={item} key={i} /></td>
    </tr>
  ));
}

class App extends Component {
  getLocalDataSourceURL(localDataSourceName) {
    switch (localDataSource) {
      case "ok": return "./test/laneSwimming.json";
      case "singleDataSourceError": return "./test/laneSwimming.s10error.json";
      case "error": return "./test/laneSwimming.error.json";
      default: return null;
    }
  }

  getDataSourceURL(localDataSource) {
    if (DEBUG && localDataSource) {
      const url = this.getLocalDataSourceURL(localDataSource);
      if (url) {
        return url;
      }
    }
    return "https://c1dz9rg5cd.execute-api.eu-west-2.amazonaws.com/prod/laneSwimmingData";
  }

  componentDidMount() {
    const url = this.getDataSourceURL(localDataSource);
    axios.get(url + "?" + new Date().getTime())
      .then(response => this.setState({ data: response.data }));
  }

  renderTimetable(timetable, vendor, key) {
    return (
      <div key={key}>
        <h1>{timetable.name || "Regular Timetable"} ({vendor || "Unknown vendor"})</h1>
        <table className="tableTimetable" cellSpacing={0} cellPadding={0}>
          <tbody>
            {timetable.days.map(dayRows)}
          </tbody>
        </table>
      </div>
    );
  }

  renderError(error, vendor, key) {
    const errorInfo = error.statusCode ? [
      error.statusCode,
      error.options && error.options.uri,
    ] : error;

    return (
      <div key={key}>
        <h1>Error {vendor || "Unknown vendor"}</h1>
        <div>{String(errorInfo)}</div>
      </div>
    );
  }

  renderTimetables(data) {
    return data.map((vendorData, vendorIdx) => {
      const { error, value, vendor } = vendorData;
      if (!error) {
        const { timetables } = value;
        const renderTimetable = (timetable, timetableIdx) => this.renderTimetable(timetable, vendor, timetableIdx);
        return timetables.map(renderTimetable);
      }
      return this.renderError(error, vendor, vendorIdx);
    });
  }

  renderGitInfo(gitInfo) {
    return (
      <React.Fragment>
        <h2>Version Info</h2>
        <span>Hash: {gitInfo.hash}, Date: {gitInfo.date}</span>
      </React.Fragment>
    )
  }

  renderApp(data) {
    return (
      <div>
        {data && this.renderTimetables(data)}
        <hr />
        {this.renderGitInfo(gitInfo)}
      </div>
    );
  }

  render() {
    const app = this.renderApp(this.state && this.state.data);
    return (
      <div className="App">{app}</div>
    );
  }
}

export default App;
