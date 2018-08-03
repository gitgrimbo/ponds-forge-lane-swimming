import React from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Item = ({ item }) => {
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
      <div>{item.room}{item.location}</div>
      <div>{alterations}</div>
    </div>
  );
};

function dayRow(i, dayNameCell, item) {
  return (
    <tr key={i}>
      {dayNameCell(i)}
      <td>{item.startTime}</td>
      <td>{item.endTime}</td>
      <td><Item item={item} key={i} /></td>
    </tr>
  );
}

function dayRows(day) {
  const dayName = isNaN(day.day) ? day.day : DAYS[day.day];
  const item0 = day.items[0];
  if (!item0) {
    return null;
  }
  const dayNameCell = (i) => (i === 0) ? <td rowSpan={day.items.length}>{dayName}</td> : null;
  return day.items.map((item, i) => dayRow(i, dayNameCell, item));
}

const Timetable = ({ timetable }) => (
  <table className="tableTimetable" cellSpacing={0} cellPadding={0}>
    <tbody>
      {timetable.days.map(dayRows)}
    </tbody>
  </table>
);

export default Timetable;
