const zip = require("lodash.zip");

const Trace = require("./Trace");
const PondsForgeAPI = require("./ponds-forgev2/PondsForgeAPI");
const S10API = require("./s10v2/S10API");

class LaneSwimmingAPI {
    constructor() {
        this.pondsForgeAPI = new PondsForgeAPI();
        this.s10API = new S10API();
    }

    timetables(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        // https://stackoverflow.com/a/31424853/319878
        const squashRejections = (promise) => promise.then((v) => ({ value: v }), (err) => {
            console.log(err);
            return { error: err };
        });

        const apiCalls = [
            {
                vendor: "Ponds Forge",
                promise: this.pondsForgeAPI.timetables(opts),
            },
            {
                vendor: "S10",
                promise: this.s10API.timetables(opts),
            }
        ];

        // Squashes the rejections of the apiCall's promise, and adds a vendor field.
        const addVendor = (apiCall) => squashRejections(apiCall.promise)
            .then(response => {
                response.vendor = apiCall.vendor;
                return response;
            });

        return Promise.all(apiCalls.map(addVendor))
            .then(responses => trace.stop("LaneSwimmingAPI.timetables", responses));
    }
}

module.exports = LaneSwimmingAPI;
