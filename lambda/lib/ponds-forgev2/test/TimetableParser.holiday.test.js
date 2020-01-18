const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

const { newTimetableItem, expectTimetableItem, newAlterations } = require("./utils");
const TimetableParser = require("../TimetableParser");

describe("ponds-forgev2/TimetableParser/holiday", () => {
    let html;
    let timetable;

    before(() => {
        html = fs.readFileSync(path.join(__dirname, "./holiday-swimming-ponds-forge.html"));
        timetable = TimetableParser.timetableFromHTML(html, { trace: true });
    });

    it("expect 7 days", () => {
        expect(timetable).to.have.lengthOf(7);
    });

    it("monday", () => {
        const tt0 = timetable[0];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(1);
        expect(tt0.items).to.have.lengthOf(3);
        const expectedGeneralAlterations = newAlterations([
            "Monday 30th July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool. Swimfit Cancelled",
            "Monday 27th August: Lane swimming available 8:00am - 8:00pm in the 25 metre Competition Pool",
        ]);
        expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "22:00", "Lane (25m) Swimming", "Competition Pool", expectedGeneralAlterations));
        expectTimetableItem(tt0.items[1], newTimetableItem("1", "12:00", "14:00", "Age UK", "Competition Pool", expectedGeneralAlterations));
        expectTimetableItem(tt0.items[2], newTimetableItem("1", "20:30", "21:30", "Swimfit", "Competition Pool", expectedGeneralAlterations));
    });

    it("tuesday", () => {
        const tt0 = timetable[1];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(2);
        expect(tt0.items).to.have.lengthOf(4);
        expectTimetableItem(tt0.items[0], newTimetableItem("1", "06:30", "15:15", "Lane (25m) Swimming", "Competition Pool", newAlterations([
            "Tuesday 31st July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool",
        ])));
        // This next item is interesting as it's not formatted consistently in the HTML,
        // hence the parser gives a strange description and doesn't even try with the room.
        expectTimetableItem(tt0.items[2], newTimetableItem("1", "15:15", "16:00", "Lane Swimming", "Competition Pool", newAlterations([
            "Tuesday 31st July: Lane swimming sessions only available 6:30am - 9:45am in the 25 metre Leisure Pool",
        ])));
    });

    it("saturday", () => {
        const tt = timetable[5];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(6);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "08:00", "20:00", "Lane (50m) Swimming", "Competition Pool", newAlterations([
            "Saturday 28th July: Lane swimming unavailable all day",
            "Saturday 4th August: Lane swimming unavailable all day",
            "Saturday 11th August: Lane swimming available 8:00am - 8:00pm in the 50 metre Competition Pool",
            "Saturday 18th August: Lane swimming available 8:00am - 8:00pm in the 25 metre Diving Pool",
            "Saturday 25th August: Lane swimming available 8:00am - 7:00pm in the 25 metre Competition Pool and 7:00pm - 8:00pm in the 50 metre Competition Pool",
        ])));
    });

    it("sunday", () => {
        const tt = timetable[6];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(0);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "08:00", "20:00", "Lane (50m) Swimming", "Competition Pool", newAlterations([
            "Sunday 29th July: Lane swimming unavailable all day",
        ])));
    });
});
