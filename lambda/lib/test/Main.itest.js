const chai = require("chai");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const date = require("../date");
const LaneSwimmingAPI = require("../LaneSwimmingAPI");
const PondsForgeAPI = require("../ponds-forge/PondsForgeAPI");
const S10API = require("../s10v2/S10API");

const expect = chai.expect;

const laneSwimmingAPI = new LaneSwimmingAPI();
const s10API = new S10API();
const pondsForgeAPI = new PondsForgeAPI();

function saveFile(name, content) {
    fs.writeFileSync(path.join("temp", date.formatForFilename(new Date()) + "_" + name), content, "UTF8");
}

describe("Main", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("pondsForgeLaneSwimming", function (done) {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        pondsForgeAPI.timetables(opts)
            .then(response => {
                const responseStr = JSON.stringify(response, null, 1);
                saveFile("pondsForgeLaneSwimming.json", responseStr);

                const { activity, timetables } = response;

                expect(activity).to.be.an("object");
                expect(activity.timetables).to.be.an("array");
                expect(activity.venues).to.be.an("array");

                expect(timetables).to.be.an("array");

                const tt0 = timetables[0];
                expect(tt0.days).to.be.an("array");
                done();
            })
            .catch(done);
    });

    // Need to use full function, not lambda, for this.timeout()
    it("s10LaneSwimming", function (done) {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        s10API.timetables(opts)
            .then(response => {
                const responseStr = JSON.stringify(response, null, 1);
                saveFile("s10LaneSwimming.json", responseStr);

                const { activity, timetables } = response;

                expect(activity).to.be.an("object");
                expect(activity.timetables).to.be.an("array");
                expect(activity.venues).to.be.an("array");

                expect(timetables).to.be.an("array");

                const tt0 = timetables[0];
                expect(tt0.days).to.be.an("array");
                done();
            })
            .catch(done);
    });

    // Need to use full function, not lambda, for this.timeout()
    it("laneSwimming", function (done) {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        laneSwimmingAPI.timetables(opts)
            .then(response => {
                const responseStr = JSON.stringify(response, null, 1);
                saveFile("laneSwimming.json", responseStr);

                expect(response).to.be.an("array");

                const r0 = response[0];
                const { value, vendor } = r0;
                expect(value).to.be.an("object");
                expect(vendor).to.equal("Ponds Forge");

                const { activity, timetables } = value;

                expect(activity).to.be.an("object");
                expect(activity.timetables).to.be.an("array");
                expect(activity.venues).to.be.an("array");

                expect(timetables).to.be.an("array");

                const tt0 = timetables[0];
                expect(tt0.days).to.be.an("array");
                done();
            })
            .catch(done);
    });
});
