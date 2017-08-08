const cheerio = require("cheerio");
const Trace = require("../Trace");

class TimetableParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;

        const days = $el.find(".timetable").find(".timetable-table").toArray().map(table => {
            const dayName = $(table).parent().find("h2").eq(0).text();
            // ignore first row as that is headings
            const itemRows = $(table).find("tr").toArray().slice(1);
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
            return {
                day: dayName,
                items,
            };
        });

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
