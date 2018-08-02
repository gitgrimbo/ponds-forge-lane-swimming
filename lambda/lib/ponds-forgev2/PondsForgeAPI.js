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

class PondsForgeAPI {
    constructor(timetableSources) {
        this.timetableSources = timetableSources || [PondsForgeAPI.REGULAR_TIMETABLE_SOURCE];
    }

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

    _timetables(sources, opts) {
        const htmlPromises = sources.map((source) => sivXHRRequest(source.url, opts));
        return htmlPromises.map((p) => p.then((html) => TimetableParser.timetableFromHTML(html)));
    }

    timetables(opts) {
        return Promise.all(this._timetables(this.timetableSources, opts))
            .then((timetables) => {
                return {
                    activity: {
                        timetables: [],
                        venues: [],
                    },
                    timetables: timetables.map((timetable, timetableIdx) => {
                        return {
                            name: this.timetableSources[timetableIdx].name,
                            days: timetable,
                        };
                    }),
                };
            })
            .then((response) => this._stripAllButLaneSwimming(response));
    }

    static withHolidayTimetable() {
        return new PondsForgeAPI([PondsForgeAPI.REGULAR_TIMETABLE_SOURCE, PondsForgeAPI.HOLIDAY_TIMETABLE_SOURCE]);
    }
}

PondsForgeAPI.REGULAR_TIMETABLE_SOURCE = {
    name: "Regular",
    url: "https://www.siv.org.uk/page/swimming-ponds-forge",
};

PondsForgeAPI.HOLIDAY_TIMETABLE_SOURCE = {
    name: "Holiday",
    url: "https://www.siv.org.uk/page/holiday-swimming-ponds-forge",
};

module.exports = PondsForgeAPI;
