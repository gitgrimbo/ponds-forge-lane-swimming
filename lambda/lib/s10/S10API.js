const TimetableParser = require("./TimetableParser");

const Timetable = require("../Timetable");
const Trace = require("../Trace");
const xhr = require("../xhr");

function fetchS10Timetable(opts) {
    return xhr(Object.assign({}, opts, {
        uri: "https://www.sport-sheffield.com/Fitness-and-Wellbeing/S10health/Swimming-Pool/Swimming-Pool-Timetable",
    }));
}

class S10API {
    _timetables(opts) {
        return fetchS10Timetable(opts)
            .then(response => {
                const timetable = TimetableParser.timetableFromHTML(response);
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
        const VENUE_ID_PONDS_FORGE = "1";
        return Object.assign({}, response, {
            timetables: response.timetables.map(timetable => {
                timetable = Timetable.filterByVenueId(timetable, VENUE_ID_PONDS_FORGE);
                timetable = Timetable.filterByDescription(timetable, /Lane.*Swimming|Closed.*/);
                return timetable;
            }),
        });
    }

    timetables(opts) {
        return this._timetables(opts)
            .then(response => this._stripAllButLaneSwimming(response));
    }
}

module.exports = S10API;
