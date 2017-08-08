import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DEBUG = (window.location.href.indexOf("DEBUG") > -1);

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
    <tr>
      {dayNameCell(i)}
      <td>{item.startTime}</td>
      <td>{item.endTime}</td>
      <td><Item item={item} key={i} /></td>
    </tr>
  ));
}

class App extends Component {
  componentDidMount() {
    const realURL = "https://c1dz9rg5cd.execute-api.eu-west-2.amazonaws.com/prod/laneSwimmingData";
    const debugURL = "./test/laneSwimming.json";
    const url = DEBUG ? debugURL : realURL;
    axios.get(url + "?" + new Date().getTime())
      .then(response => this.setState({ data: response.data }));
  }

  renderTimetable(timetable, vendor, key) {
    return (
      <div key={key}>
        <h1>{timetable.name} ({vendor || "Unknown vendor"})</h1>
        <table className="tableTimetable" cellSpacing={0} cellPadding={0}>
          <tbody>
            {timetable.days.map(dayRows)}
          </tbody>
        </table>
      </div>
    );
  }

  renderApp(data) {
    if (!data) {
      return null;
    }
    return data.map(activitiesForVenue => {
      const { vendor, timetables } = activitiesForVenue;
      return timetables.map((timetable, i) => this.renderTimetable(timetable, vendor, i));
    });
  }

  render() {
    const app = this.renderApp(this.state && this.state.data);
    return (
      <div className="App">{app}</div>
    );
  }
}

export default App;
