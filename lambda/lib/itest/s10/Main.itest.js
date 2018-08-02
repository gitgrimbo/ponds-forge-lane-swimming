const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("../utils");
const S10API = require("../../s10v2/S10API");

const expect = chai.expect;

const s10API = new S10API();

describe("s10", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("itest", function(done) {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        s10API.timetables(opts)
            .then(response => {
                const responseStr = JSON.stringify(response, null, 1);
                saveFile("s10LaneSwimming.json", responseStr);

                console.log(responseStr);

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
});
