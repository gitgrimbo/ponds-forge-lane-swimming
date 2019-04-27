const settle = require("p-settle");
const TimetableParser = require("./TimetableParser");

const Timetable = require("../Timetable");
const xhr = require("../xhr");

function sivXHRRequest(uri, opts) {
    opts = Object.assign({}, opts, {
        uri,
        gzip: true,
    });

    return xhr(opts)
        .catch((error) => {
            error.uri = uri;
            throw error;
        });
}

class PondsForgeAPI {
    constructor(timetableSources) {
        this.timetableSources = timetableSources || [PondsForgeAPI.REGULAR_TIMETABLE_SOURCE];
    }

    _stripAllButLaneSwimming(timetables) {
        const VENUE_ID_PONDS_FORGE = "1";

        return timetables.map((timetable) => {
            timetable = Timetable.filterByVenueId(timetable, VENUE_ID_PONDS_FORGE);
            // We use $ for end of regex to filter out other Lane Swimming items such as "Lane Swimming For Beginners"
            timetable = Timetable.filterByDescription(timetable, /Lane.*(Swimming)?$/);
            return timetable;
        });
    }

    _timetablePromises(sources, opts) {
        return sources
            .map((source) => sivXHRRequest(source.url, opts))
            .map(async (htmlPromise) => TimetableParser.timetableFromHTML(await htmlPromise));
    }

    async timetables(opts) {
        const responses = await settle(this._timetablePromises(this.timetableSources, opts));

        return responses.map((response, i) => {
            let {
                isFulfilled,
                value: timetable,
                reason: error,
            } = response;

            const name = this.timetableSources[i].name;

            if (isFulfilled) {
                return {
                    name,
                    timetable,
                };
            }

            if (error.statusCode === 404) {
                error = {
                    uri: error.uri,
                    message: "Timetable not found",
                };
            }

            return {
                name,
                error,
            };
        });
    }

    static withHolidayTimetable() {
        return new PondsForgeAPI([
            PondsForgeAPI.REGULAR_TIMETABLE_SOURCE,
            PondsForgeAPI.HOLIDAY_TIMETABLE_SOURCE,
        ]);
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
