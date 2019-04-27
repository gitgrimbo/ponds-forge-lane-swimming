const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("../utils");
const S10API = require("../../s10v2/S10API");

const expect = chai.expect;

const s10API = new S10API();

describe("s10", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("itest", async function() {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        const logResponse = false;

        const response = await s10API.timetables(opts)
        const responseStr = JSON.stringify(response, null, 1);
        saveFile("s10LaneSwimming.json", responseStr);

        if (logResponse) {
            console.log("---------- s10API.timetables response START ----------");
            console.log(responseStr);
            console.log("---------- s10API.timetables response END   ----------");
        }

        expect(response).to.be.an("array");
        expect(response).to.not.have.lengthOf(0);

        const { name, timetable } = response[0];
        expect(name).to.equal("Regular");
        expect(timetable).to.be.an("array");
    });
});
