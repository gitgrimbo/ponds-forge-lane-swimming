const Trace = require("./Trace");
const PondsForgeAPI = require("./ponds-forge/PondsForgeAPI");
const S10API = require("./s10/S10API");

class LaneSwimmingAPI {
    constructor() {
        this.pondsForgeAPI = new PondsForgeAPI();
        this.s10API = new S10API();
    }

    timetables(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        return Promise.all([
            this.pondsForgeAPI.timetables(opts),
            this.s10API.timetables(opts),
        ])
            .then(responses => {
                responses[0].vendor = "Ponds Forge";
                responses[1].vendor = "S10";
                return trace.stop("LaneSwimmingAPI.timetables", responses);
            });
    }
}

module.exports = LaneSwimmingAPI;
