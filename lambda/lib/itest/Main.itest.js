const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("./utils");
const LaneSwimmingAPI = require("../LaneSwimmingAPI");

const expect = chai.expect;

const laneSwimmingAPI = new LaneSwimmingAPI();

describe("Main", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("laneSwimming", function(done) {
        this.timeout(10 * 1000);

        const opts = {
            trace: true,
            saveResources: true,
        };

        laneSwimmingAPI.timetables(opts)
            .then(response => {
                const responseStr = JSON.stringify(response, null, 1);
                saveFile("laneSwimming.json", responseStr);

                console.log(responseStr);

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
                expect(timetables).to.not.have.lengthOf(0);

                const tt0 = timetables[0];
                expect(tt0.days).to.be.an("array");
                done();
            })
            .catch(done);
    });
});
