const addDays = require("date-fns/add_days");

const TimetableParser = require("./TimetableParser");

const Timetable = require("../Timetable");
const Trace = require("../Trace");
const xhr = require("../xhr");

function yyyyMMdd(date) {
    return date.toISOString().substring(0, 10);;
}

function fetchS10Timetable(opts) {
    opts = opts || {};
    let { start, end } = opts;

    const now = new Date();
    start = start || yyyyMMdd(now);
    end = end || yyyyMMdd(addDays(now, 7));

    const xhrOpts = {
        uri: "https://www.sport-sheffield.com/online/api/activities/resourcegroup/SP-TT",
        qs: {
            start,
            end,
            "resource[]": "POOL",
            "groupbyname": "false",
        },
    };
    return xhr(xhrOpts);
}

class S10API {
    _timetables(opts) {
        return fetchS10Timetable(opts)
            .then(response => {
                const timetable = TimetableParser.timetableFromJSON(response);
                const timetables = [
                    {
                        id: "1",
                        name: "Timetable",
                        days: timetable,
                    }
                ];
                const activity = {
                    timetables: [
                        {
                            id: "1",
                            name: "Timetable",
                        }
                    ],
                    venues: [
                        {
                            id: "1",
                        }
                    ],
                };
                return {
                    activity,
                    timetables,
                };
            });
    }

    _stripAllButLaneSwimming(response) {
        const timetables = response.timetables
            .map(timetable => Timetable.filterByDescription(timetable, /Lane.*Swimming|Closed.*/));
        return Object.assign({}, response, {
            timetables,
        });
    }

    timetables(opts) {
        return this._timetables(opts)
            .then(response => this._stripAllButLaneSwimming(response));
    }
}

module.exports = S10API;
