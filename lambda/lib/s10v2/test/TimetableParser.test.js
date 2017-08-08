const chai = require("chai");
const fs = require("fs");
const path = require("path");
const TimetableParser = require("../TimetableParser");

const expect = chai.expect;

describe("s10v2/TimetableParser", () => {
    it("timetableFromJSON", () => {
        const json = fs.readFileSync(path.join(__dirname, "./online_api_activities_resourcegroup_SP-TT"));

        const timetable = TimetableParser.timetableFromJSON(json, { trace: true });

        expect(timetable).to.have.lengthOf(7);

        const tt0 = timetable[0];
        expect(tt0).to.be.an("object");
        expect(tt0.day).to.equal(6);
        expect(tt0.items).to.have.lengthOf(3);

        const tt0item0 = tt0.items[0];
        expect(tt0item0).to.be.an("object");
        expect(tt0item0.startTime).to.equal("09:00");
        expect(tt0item0.endTime).to.equal("16:00");
        expect(tt0item0.description).to.equal("Lane Swimming");

        const tt1 = timetable[1];
        expect(tt1).to.be.an("object");
        expect(tt1.day).to.equal(7);
        expect(tt1.items).to.have.lengthOf(2);

        const tt1item0 = tt1.items[0];
        expect(tt1item0).to.be.an("object");
        expect(tt1item0.startTime).to.equal("09:00");
        expect(tt1item0.endTime).to.equal("17:00");
        expect(tt1item0.description).to.equal("Lane Swimming");
    });
});
