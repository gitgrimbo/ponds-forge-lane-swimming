const cheerio = require("cheerio");
const Trace = require("../Trace");

class TimetableParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
    }

    dayNameTodayIndex(dayName) {
        const DAY_NAMES = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const idx = DAY_NAMES.indexOf(dayName);
        return (idx > -1) ? idx : 0;
    }

    _extractDayFromTable(table) {
        const $ = this.$;
        const $table = $(table);

        // ignore first row as that is headings
        const itemRows = $table.find("tr").toArray().slice(1);
        const items = itemRows.map(tr => {
            const tds = $(tr).find("td").toArray();
            const time = $(tds[1]).text().trim().split(" - ");
            return {
                venueId: "1",
                description: $(tds[0]).text(),
                startTime: time[0],
                endTime: time[1],
                room: $(tds[2]).text(),
            };
        });

        const dayName = $table.parent().find("h2").eq(0).text();
        const dayIdx = this.dayNameTodayIndex(dayName);
        return {
            day: dayIdx,
            items,
        };
    }

    _addAlterations(day) {
        return Object.assign({}, day, {
            items: day.items.map(item => {
                if (item.description.match(/Closed/)) {
                    return Object.assign({}, item, {
                        alterations: [{
                            message: item.description,
                        }],
                    });
                }
                return item;
            }),
        });
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;

        const tables = $el.find(".timetable").find(".timetable-table").toArray();
        const days = tables
            .map(this._extractDayFromTable.bind(this))
            .map(this._addAlterations.bind(this));

        return trace.stop("parse", days);
    }

    static timetableFromElement($, $el, opts) {
        return new TimetableParser($, $el).parse(opts);
    }

    static timetableFromHTML(html, opts) {
        const $ = cheerio.load(html);
        return TimetableParser.timetableFromElement($, $(":root"), opts);
    }
}

module.exports = TimetableParser;
