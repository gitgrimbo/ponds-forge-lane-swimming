import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

class Item extends Component {
  render() {
    const { item } = this.props;
    const alterations = [];
    if (item.alterations && item.alterations.length > 0) {
      item.alterations.forEach(alteration => {
        alterations.push(<br />);
        alterations.push(<span style={{ color: "red" }}>{alteration.date + ", " + alteration.message}</span>);
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
  const dayIdx = parseInt(day.day, 10);
  const dayName = isNaN(dayIdx) ? day.day : DAYS[dayIdx];
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
    const url = "https://c1dz9rg5cd.execute-api.eu-west-2.amazonaws.com/prod/laneSwimmingData";
    //const url = "http://localhost:8080/20170603-111016_laneSwimming.json";
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
