const chai = require("chai");
const mkdirp = require("mkdirp");

const { saveFile } = require("../utils");
const PondsForgeAPI = require("../../ponds-forgev2/PondsForgeAPI");

const expect = chai.expect;

const pondsForgeAPI = new PondsForgeAPI();

describe("ponds-forge", () => {
    mkdirp.sync("temp");

    // Need to use full function, not lambda, for this.timeout()
    it("pondsForgeLaneSwimming", function(done) {
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
});
