const chai = require("chai");
const path = require("path");
const loadJsonFile = require("load-json-file");
const TimetableParser = require("../TimetableParser");

const expect = chai.expect;

describe("ponds-forge/TimetableParser", () => {
    it("timetableFromHTML", () => {
        const json = loadJsonFile.sync(path.join(__dirname, "./activity_fetchTimetable_timetableId_2_164.json"));

        const timetable = TimetableParser.timetableFromHTML(json.data.html, { trace: true });

        expect(timetable).to.have.lengthOf(7);

        const tt0 = timetable[0];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(1);
        expect(tt0.items).to.have.lengthOf(42);

        const item0 = tt0.items[0];
        expect(item0).to.be.an("object");
        expect(item0.venueId).to.equal("8");
        expect(item0.startTime).to.equal("05:30");
        expect(item0.endTime).to.equal("11:25");
        expect(item0.description).to.equal("Lane Swimming");
        expect(item0.room).to.equal("Rock Pool");

        const item1 = tt0.items[1];
        expect(item1).to.be.an("object");
        expect(item1.venueId).to.equal("1");
        expect(item1.startTime).to.equal("06:30");
        expect(item1.endTime).to.equal("16:00");
        expect(item1.description).to.equal("Lane (25m) Swimming");
        expect(item1.room).to.equal("Competition Pool");
        expect(item1.alterations).to.have.lengthOf(1);

        const alteration0 = item1.alterations[0];
        expect(alteration0).to.be.an("object");
        expect(alteration0.date).to.equal("29th May");
        expect(alteration0.message).to.equal("Lane swimming unavailable.");
    });
});
