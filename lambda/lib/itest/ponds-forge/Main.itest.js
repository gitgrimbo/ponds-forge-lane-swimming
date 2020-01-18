const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("../utils");
const PondsForgeAPI = require("../../ponds-forgev3/PondsForgeAPI");

const expect = chai.expect;

const pondsForgeAPI = new PondsForgeAPI();

describe("ponds-forge", () => {
    mkdirp.sync("temp");

    function expectTimetable(timetable, name) {
        if (timetable.error) {
            console.error(timetable.error);
        }
        expect(timetable.error, "timetable.error").to.be.undefined;
        expect(timetable.name, "timetable.name").to.equal(name);
        expect(timetable.timetable, "timetable.timetable").to.be.an("array");
    }

    // Need to use full function, not lambda, for this.timeout()
    it("pondsForgeLaneSwimming", async function() {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        const logResponse = true;

        const response = await pondsForgeAPI.timetables(opts);
        const responseStr = JSON.stringify(response, null, 1);
        saveFile("pondsForgeLaneSwimming.json", responseStr);

        if (logResponse) {
            console.log("---------- pondsForgeAPI.timetables response START ----------");
            console.log(responseStr);
            console.log("---------- pondsForgeAPI.timetables response END   ----------");
        }

        expect(response).to.be.an("array");
        // length 1 because this Ponds Forge integration test doesn't check for holiday timetable
        expect(response).to.have.lengthOf(1);

        expectTimetable(response[0], "Regular");

        const numTimetables = response.reduce((num, { timetable }) => num + timetable.length, 0);
        // Should be at least 1 timetable
        expect(numTimetables).to.be.greaterThan(0);
    });
});
