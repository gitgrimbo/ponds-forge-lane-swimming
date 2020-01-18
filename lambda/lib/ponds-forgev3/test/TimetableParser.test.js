const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

const { newTimetableItem, expectTimetableItem } = require("./utils");
const TimetableParser = require("../TimetableParser");

describe("ponds-forgev3/TimetableParser", () => {
    let html;
    let timetable;

    before(() => {
        html = fs.readFileSync(path.join(__dirname, "./swimming-ponds-forge.html"));
        timetable = TimetableParser.timetableFromHTML(html, { trace: true });
    });

    it("expect 7 days", () => {
        expect(timetable).to.have.lengthOf(7);
        const expectedDays = [1, 2, 3, 4, 5, 6, 0];
        timetable.forEach(({ day, items }, idx) => {
            expect(day).to.equal(expectedDays[idx]);
        });
    });

    it("monday", () => {
        const tt0 = timetable[0];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(1);
        expect(tt0.items).to.have.lengthOf(4);
        expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "08:00", "Lane (25m) Swimming", "Diving Pool", []));
        expectTimetableItem(tt0.items[1], newTimetableItem("1", "08:00", "22:00", "Lane (25m) Swimming", "Competition Pool"));
        expectTimetableItem(tt0.items[2], newTimetableItem("1", "12:00", "14:00", "Age UK (Session available to all Age UK card holders)", "Competition Pool"));
        expectTimetableItem(tt0.items[3], newTimetableItem("1", "20:30", "21:30", "Swimfit", "Competition Pool"));
    });

    it("tuesday", () => {
        const tt0 = timetable[1];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(2);
        expect(tt0.items).to.have.lengthOf(4);
        expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "15:15", "Lane (25m) Swimming", "Competition Pool"));
        expectTimetableItem(tt0.items[1], newTimetableItem("1", "06:45", "08:15", "Swimfit  (Diving Pit)", "Competition Pool")); // TODO - should recognise Diving Pit
        expectTimetableItem(tt0.items[2], newTimetableItem("1", "15:15", "16:00", "Lane - Limited Lanes", "Competition Pool"));
        expectTimetableItem(tt0.items[3], newTimetableItem("1", "16:00", "22:00", "Lane (50m) Swimming", "Competition Pool"));
    });

    it("saturday", () => {
        const tt = timetable[5];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(6);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "?", "?", "Lane Swimming", "Competition Pool"));
        // TODO - this day should be a single alteration
    });

    it("sunday", () => {
        const tt = timetable[6];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(0);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "?", "?", "Lane Swimming", "Competition Pool"));
        // TODO - this day should be a single alteration
    });
});
