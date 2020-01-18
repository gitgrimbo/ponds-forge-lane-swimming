const cheerio = require("cheerio");
const Trace = require("../Trace");
const makeDay = require("./makeDay");

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

    makeDays($el) {
        const days = [];
        const lines = [];
        let dayIdx = -1;
        const competitionPoolHeading = $el.find("[id='Competition Pool']").parent();
        let p = competitionPoolHeading;
        while ((p = p.next("p")).length) {
            const first = p.children().first();
            if (!first || !first.length) {
                continue;
            }
            let newDayIdx = -1;
            if (first.prop("tagName") === "STRONG") {
                const dayName = first.text().trim();
                newDayIdx = this.dayNameTodayIndex(dayName);
            }
            if (newDayIdx > -1) {
                if (dayIdx > -1) {
                    days.push(makeDay(dayIdx, lines));
                    lines.length = 0;
                }
                lines.push(...p.text().split("\n").slice(1));
                if (days.length === 7) {
                    return days;
                }
                dayIdx = newDayIdx;
            } else {
                if (dayIdx > -1) {
                    lines.push(...p.text().split("\n"));
                }
            }
        }
        if (dayIdx > -1) {
            days.push(makeDay(dayIdx, lines));
        }
        //days.forEach(d => console.log(d.day, d.items));
        return days;
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;

        const days = this.makeDays($el);

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
