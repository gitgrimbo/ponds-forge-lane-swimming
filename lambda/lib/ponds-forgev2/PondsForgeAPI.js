const TimetableParser = require("./TimetableParser");

const Timetable = require("../Timetable");
const Trace = require("../Trace");
const xhr = require("../xhr");

function sivXHRRequest(uri, opts) {
    opts = Object.assign({}, opts, {
        uri,
        gzip: true,
    });

    return xhr(opts);
}

function fetchTimetable(opts) {
    return sivXHRRequest("https://www.siv.org.uk/page/swimming-ponds-forge", opts);
}

class PondsForgeAPI {
    _stripAllButLaneSwimming(response) {
        const VENUE_ID_PONDS_FORGE = "1";
        return Object.assign({}, response, {
            timetables: response.timetables.map(timetable => {
                timetable = Timetable.filterByVenueId(timetable, VENUE_ID_PONDS_FORGE);
                // We use $ for end of regex to filter out other Lane Swimming items such as "Lane Swimming For Beginners"
                timetable = Timetable.filterByDescription(timetable, /Lane.*(Swimming)?$/);
                return timetable;
            }),
        });
    }

    timetables(opts) {
        return fetchTimetable(opts)
            .then((html) => TimetableParser.timetableFromHTML(html))
            .then((timetable) => {
                return {
                    activity: {
                        timetables: [],
                        venues: [],
                    },
                    timetables: [{
                        days: timetable,
                    }],
                };
            })
            .then((response) => this._stripAllButLaneSwimming(response));
    }
}

module.exports = PondsForgeAPI;
