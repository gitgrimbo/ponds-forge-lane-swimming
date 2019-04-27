import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Timetable from "./Timetable";
import gitInfo from "./static/gitInfo.json";

const url = new URL(window.location.href);
console.log("Use DEBUG query parameter to use local data (not live data).");
const DEBUG = url.searchParams.get("DEBUG") !== "false";
const localDataSource = url.searchParams.get("localDataSource");


const GitInfo = ({ gitInfo }) => (
  <React.Fragment>
    <h2>Version Info</h2>
    <span>Hash: {gitInfo.hash}, Date: {gitInfo.date}</span>
  </React.Fragment>
);


class App extends Component {
  getLocalDataSourceURL(localDataSourceName) {
    switch (localDataSource) {
      case "ok": return "./test/laneSwimming.json";
      case "singleDataSourceError": return "./test/laneSwimming.s10error.json";
      case "error": return "./test/laneSwimming.error.json";
      case "20190427": return "./test/20190427-225524_laneSwimming.json";
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

  async componentDidMount() {
    const url = this.getDataSourceURL(localDataSource);
    const response = await axios.get(url + "?" + new Date().getTime());
    this.setState({ data: response.data });
  }

  renderTimetable(name, timetable, vendor, key) {
    return (
      <div key={key}>
        <h1>{name || "Regular Timetable"} ({vendor || "Unknown vendor"})</h1>
        <Timetable timetable={timetable} />
      </div>
    );
  }

  renderError(error, vendor, key) {
    const errorInfo = error.statusCode
      ? [
        error.statusCode,
        error.options && error.options.uri,
      ]
      : (typeof error === "string")
        ? error
        : JSON.stringify(error);

    return (
      <div key={key}>
        <h1>Error {vendor || "Unknown vendor"}</h1>
        <div>{String(errorInfo)}</div>
      </div>
    );
  }

  renderTimetables(data) {
    return data.reduce((result, { vendor, timetables }) => {
      timetables.forEach(({ name, timetable, error }) => {
        result.push(
          error
            ? this.renderError(error, vendor, result.length)
            : this.renderTimetable(name, timetable, vendor, result.length)
        );
      });
      return result;
    }, []);
  }

  renderApp(data) {
    return (
      <div>
        {data && this.renderTimetables(data)}
        <hr />
        <GitInfo gitInfo={gitInfo} />
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
