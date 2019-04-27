const zip = require("lodash.zip");

const Trace = require("./Trace");
const PondsForgeAPI = require("./ponds-forgev2/PondsForgeAPI");
const S10API = require("./s10v2/S10API");

class LaneSwimmingAPI {
    constructor() {
        this.pondsForgeAPI = PondsForgeAPI.withHolidayTimetable();
        this.s10API = new S10API();
    }

    async timetables(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

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

        const responses = await Promise.all(
            apiCalls.map(async ({ vendor, promise }) => {
                try {
                    const timetables = await promise;
                    return {
                        timetables,
                        vendor,
                    };
                } catch (error) {
                    console.error(vendor);
                    console.error(error);
                    return {
                        vendor,
                        error,
                    };
                }
            })
        );

        return trace.stop("LaneSwimmingAPI.timetables", responses);
    }
}

module.exports = LaneSwimmingAPI;
