const chai = require("chai");
const fs = require("fs");
const path = require("path");
const TimetableParser = require("../TimetableParser");

const expect = chai.expect;

describe("s10/TimetableParser", () => {
    const html = fs.readFileSync(path.join(__dirname, "./s10_swimming_timetable.html"));
    it("timetableFromHTML", () => {
        const timetable = TimetableParser.timetableFromHTML(html, { trace: true });

        expect(timetable).to.have.lengthOf(7);

        const tt0 = timetable[0];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal("Monday");
        expect(tt0.items).to.have.lengthOf(1);

        const tt0item0 = tt0.items[0];
        expect(tt0item0).to.be.an("object");
        expect(tt0item0.venueId).to.equal("1");
        expect(tt0item0.startTime).to.equal("07:00");
        expect(tt0item0.endTime).to.equal("22:00");
        expect(tt0item0.description).to.equal("Closed for maintenance");
        expect(tt0item0.room).to.equal("Swimming Pool");

        const tt1 = timetable[1];
        expect(tt1).to.be.an("object");
        expect(tt1.day).to.equal("Tuesday");
        expect(tt1.items).to.have.lengthOf(5);

        const tt1item0 = tt1.items[0];
        expect(tt1item0).to.be.an("object");
        expect(tt1item0.venueId).to.equal("1");
        expect(tt1item0.startTime).to.equal("07:00");
        expect(tt1item0.endTime).to.equal("21:00");
        expect(tt1item0.description).to.equal("Lane Swimming");
        expect(tt1item0.room).to.equal("Swimming Pool");
    });
});
