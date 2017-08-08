const TimetableParser = require("./TimetableParser");
const ActivityParser = require("./ActivityParser");

const Timetable = require("../Timetable");
const Trace = require("../Trace");
const xhr = require("../xhr");

function sivXHRRequest(uri, opts) {
    opts = Object.assign({}, opts, {
        uri,
        gzip: true,
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        }
    });

    return xhr(opts)
        .then(response => JSON.parse(response));
}

// https://siv.org.uk/contentable/content/activity/164
// https://siv.org.uk/contentable/activity/fetchTimetable/timetableId/2/164

function fetchActivity(id, opts) {
    id = id || "164";
    return sivXHRRequest("https://siv.org.uk/contentable/content/activity/" + id, opts);
}

function fetchTimetable(id, opts) {
    id = id || "timetableId/2/164";
    return sivXHRRequest("https://siv.org.uk/contentable/activity/fetchTimetable/" + id, opts);
}

class PondsForgeAPI {
    _timetables(opts) {
        const response = {};
        return this.activity(null, opts)
            .then(activity => response.activity = activity)
            .then(_ => response.activity.timetables.map(timetable => this.timetable(timetable.id, opts)))
            .then(timetablePromises => Promise.all(timetablePromises))
            .then(timetables => {
                const timetablesTrace = Trace.pluckTraces(timetables);
                const activityTrace = Trace.pluckTrace(response.activity);
                response.timetables = timetables.map((timetable, i) => Object.assign({}, response.activity.timetables[i], {
                    days: timetable,
                }));
                response._trace = {
                    activity: activityTrace,
                    timetables: timetablesTrace,
                };
                return response;
            });
    }

    _stripAllButLaneSwimming(response) {
        const VENUE_ID_PONDS_FORGE = "1";
        return Object.assign({}, response, {
            timetables: response.timetables.map(timetable => {
                timetable = Timetable.filterByVenueId(timetable, VENUE_ID_PONDS_FORGE);
                timetable = Timetable.filterByDescription(timetable, /Lane.*Swimming/);
                return timetable;
            }),
        });
    }

    timetables(opts) {
        return this._timetables(opts)
            .then(response => this._stripAllButLaneSwimming(response));
    }

    activity(id, opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        return fetchActivity(id, opts)
            .then(response => trace.stop("PondsForgeAPI.fetchActivity", ActivityParser.activityFromHTML(response.data.html, opts)));
    }

    timetable(id, opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        return fetchTimetable(id, opts)
            .then(response => trace.stop("PondsForgeAPI.timetable", TimetableParser.timetableFromHTML(response.data.html, opts)));
    }
}

module.exports = PondsForgeAPI;
