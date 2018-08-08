const { expect } = require("chai");
const fs = require("fs");
const path = require("path");

const { newTimetableItem, expectTimetableItem, newAlterations } = require("./utils");
const TimetableParser = require("../TimetableParser");

describe("ponds-forgev2/TimetableParser/20180808-holiday", () => {
    const html = fs.readFileSync(path.join(__dirname, "./20180808-holiday-swimming-ponds-forge.html"));

    const timetable = TimetableParser.timetableFromHTML(html, { trace: true });

    it("expect 7 days", () => {
        expect(timetable).to.have.lengthOf(7);
    });

    it("monday", () => {
        const tt = timetable[0];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(1);
        expect(tt.items).to.have.lengthOf(3);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "06:30", "22:00", "Lane (25m) Swimming", "Competition Pool", newAlterations([
            "(27th August: Lane swimming only available 8:00am - 8:00pm in the 25 metre competition pool)",
        ])));
        expectTimetableItem(tt.items[1], newTimetableItem("1", "12:00", "14:00", "Age UK", "Competition Pool", []));
        expectTimetableItem(tt.items[2], newTimetableItem("1", "20:30", "21:30", "Swimfit", "Competition Pool", []));
    });

    it("tuesday", () => {
        const tt = timetable[1];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(2);
        expect(tt.items).to.have.lengthOf(4);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "06:30", "15:15", "Lane (25m) Swimming", "Competition Pool", []));
        expectTimetableItem(tt.items[1], newTimetableItem("1", "12:00", "14:00", "Age UK", "Competition Pool", []));
        expectTimetableItem(tt.items[2], newTimetableItem("1", "15:15", "16:00", "Lane Swimming", "Competition Pool", []));
    });

    it("saturday", () => {
        const tt = timetable[5];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(6);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "?", "?", "Lane Swimming", "Competition Pool", newAlterations([
            "August Availability",
            "11th August: Lane swimming available 8:00am - 8:00pm in the 50 metre competition pool",
            "18th August: Lane swimming available 8:00am - 8:00pm in the 50 metre competition pool",
            "25th August: Lane swimming available 8:00am - 8:00pm in the 25 metre competition pool",
        ])));
    });

    it("sunday", () => {
        const tt = timetable[6];
        expect(tt).to.be.an("object");
        expect(tt.day).to.equal(0);
        expect(tt.items).to.have.lengthOf(1);
        expectTimetableItem(tt.items[0], newTimetableItem("1", "?", "?", "Lane Swimming", "Competition Pool", newAlterations([
            "August Availability",
            "12th August: Lane swimming available 8:00am - 8:00pm in the 50 metre competition pool",
            "19th August: Lane swimming available 8:00am - 8:00pm in the 50 metre competition pool",
            "26th August: Lane swimming available 8:00am - 8:00pm in the 50 metre competition pool",
        ])));
    });
});
