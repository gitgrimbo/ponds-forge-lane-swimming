const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("./utils");
const LaneSwimmingAPI = require("../LaneSwimmingAPI");

const expect = chai.expect;

const laneSwimmingAPI = new LaneSwimmingAPI();

describe("Main", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("laneSwimming", async function() {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        const logResponse = false;

        const response = await laneSwimmingAPI.timetables(opts);
        const responseStr = JSON.stringify(response, null, 1);
        saveFile("laneSwimming.json", responseStr);

        if (logResponse) {
            console.log("---------- laneSwimmingAPI.timetables response START ----------");
            console.log(responseStr);
            console.log("---------- laneSwimmingAPI.timetables response END   ----------");
        }

        expect(response).to.be.an("array");

        const r0 = response[0];
        const { timetables, vendor } = r0;
        expect(timetables).to.be.an("array");
        expect(vendor).to.equal("Ponds Forge");

        expect(timetables).to.be.an("array");
        expect(timetables).to.not.have.lengthOf(0);

        const tt0 = timetables[0];
        expect(tt0.timetable).to.be.an("array");
    });
});
