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
            });
    }
}

module.exports = PondsForgeAPI;
