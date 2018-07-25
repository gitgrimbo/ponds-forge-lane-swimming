const chai = require("chai");
const path = require("path");
const loadJsonFile = require("load-json-file");
const ActivityParser = require("../ActivityParser");

const expect = chai.expect;

describe("ActivityParser", () => {
    it("activityFromHTML", () => {
        const json = loadJsonFile.sync(path.join(__dirname, "./content_activity_164.json"));

        const activity = ActivityParser.activityFromHTML(json.data.html, { trace: true });

        expect(activity).to.be.an("object");
        expect(activity.venues).to.have.lengthOf(6);
        expect(activity.timetables).to.have.lengthOf(2);

        const v0 = activity.venues[0];
        expect(v0.id).to.equal("2");
        expect(v0.name).to.equal("Concord SC");

        const tt0 = activity.timetables[0];
        expect(tt0.id).to.equal("timetableId/2/164");
        expect(tt0.name).to.equal("Swimming (Term Time)");
    });

    it("activityFromHTML.20170607", () => {
        const json = loadJsonFile.sync(path.join(__dirname, "./content_activity_164.20170607.json"));

        const activity = ActivityParser.activityFromHTML(json.data.html, { trace: true });

        expect(activity).to.be.an("object");
        expect(activity.venues).to.have.lengthOf(6);
        expect(activity.timetables).to.have.lengthOf(0);

        const v0 = activity.venues[0];
        expect(v0.id).to.equal("2");
        expect(v0.name).to.equal("Concord SC");

        const dtt = activity.defaultTimetable;
        expect(dtt).to.be.an("array");
        expect(dtt).to.have.lengthOf(7);

        const day0 = dtt[0];
        expect(day0).to.be.an("object");
        expect(day0.day).to.equal(3);
        expect(day0.items).to.be.an("array");
        expect(day0.items).to.have.lengthOf(42);
    });
});
