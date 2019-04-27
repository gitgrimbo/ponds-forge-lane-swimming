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
    async _timetables(opts) {
        const json = await fetchS10Timetable(opts);
        const timetable = TimetableParser.timetableFromJSON(json);
        return [
            {
                name: "Regular",
                timetable,
            },
        ];
    }

    _stripAllButLaneSwimming(timetables) {
        return timetables.map(
            (timetable) => ({
                ...timetable,
                timetable: Timetable.filterByDescription(timetable.timetable, /Lane.*Swimming|Closed.*/),
            })
        );
    }

    async timetables(opts) {
        const timetables = await this._timetables(opts);
        return this._stripAllButLaneSwimming(timetables);
    }
}

module.exports = S10API;
