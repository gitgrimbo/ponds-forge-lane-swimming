const cheerio = require("cheerio");
const Trace = require("../Trace");
const normaliseTime = require("../ponds-forge/normaliseTime");

function fixStr(s) {
    return s.replace(/[\u202F\u00A0]/, " ");
}

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

    makeDay(dayIdx, lines) {
        function newItem() {
            return {
                venueId: "1",
                alterations: [],
            };
        }
        function handleTimetableLine(startTime, endTime, description) {
            item.startTime = normaliseTime(startTime);
            item.endTime = normaliseTime(endTime);
            item.description = description;

            function addInfo(description, room, alteration) {
                item.description = description;
                item.room = room;
                if (alteration) {
                    const match = alteration.match(/^\s*-\s*(.*)/);
                    if (match) {
                        alteration = match[1];
                    }
                    if (!alteration.match(/see below/i)) {
                        item.alterations.push({
                            message: fixStr(alteration),
                        });
                    }
                }
            }

            let match;

            // E.g. "Lane (25m) Swimming"
            match = item.description.match(/^(Lane \(\d\dm\) )(in Diving Pool)(.*)/);
            if (match) {
                return addInfo(match[1].trim() + " Swimming", "Diving Pool", match[3].trim());
            }

            match = item.description.match(/^(Lane \(\d\dm\) Swimming)(.*)/);
            if (match) {
                return addInfo(match[1].trim(), "Competition Pool", match[2].trim());
            }
        }
        const items = [];
        let item;
        let expectingAlteration = false;
        lines.forEach((line) => {
            //console.log(line);
            if (!item) {
                item = newItem();
            }
            // Check for this full line and ignore if matches.
            // The real alterations will come on subsequent lines.
            if (line.match(/Changes/)) {
                return expectingAlteration = true;
            }
            if (expectingAlteration) {
                item.alterations.push({
                    message: fixStr(line),
                });
                return;
            }
            if (line.match(/^\d/)) {
                expectingAlteration = false;
                item = newItem();
                items.push(item);
                const match = line.match(/^([^\s]+) - ([^\s]+): (.*)/);
                match && handleTimetableLine(match[1], match[2], match[3]);
            }
        });
        return {
            day: dayIdx,
            items,
        };
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
                    days.push(this.makeDay(dayIdx, lines));
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
            days.push(this.makeDay(dayIdx, lines));
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
