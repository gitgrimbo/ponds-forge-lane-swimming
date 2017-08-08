const Trace = require("../Trace");

function date(isoDateTimeStr) {
    return isoDateTimeStr.substring(0, 10);
}

function time(isoDateTimeStr) {
    return isoDateTimeStr.substring(11, 16);
}

class TimetableParser {
    constructor(response) {
        this.response = response;
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const dateMap = this.response
            .reduce((days, item) => {
                const key = date(item.start);
                const items = days[key] || [];
                items.push(item);
                days[key] = items;
                return days;
            }, {});

        const dateArr = Object.keys(dateMap)
            .sort((a, b) => a.localeCompare(b));

        const s10ItemToOurAPIItem = (item) => {
            const { description, location, title } = item;
            return {
                description,
                title,
                location,
                startTime: time(item.start),
                endTime: time(item.end),
            };
        };

        const days = dateArr
            .map(dateKey => {
                const items = dateMap[dateKey];
                const day = new Date(items[0].start).getDay();
                const isSunday = day === 0;
                return {
                    day: isSunday ? 7 : day,
                    items: items.map(s10ItemToOurAPIItem),
                }
            });

        //days.forEach(day => console.log(day));

        return trace.stop("parse", days);
    }

    static timetableFromJSON(json, opts) {
        return new TimetableParser(JSON.parse(json)).parse(opts);
    }
}

module.exports = TimetableParser;
