const cheerio = require("cheerio");
const lp = require("left-pad");
const Trace = require("../Trace");

class TimetableParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
    }

    normaliseTime(timeStr) {
        const exec = /(.*)(am|pm)/.exec(timeStr);
        const pm = exec[2] === "pm";
        const time = (exec[1] || "").trim();
        if (!time) {
            return timeStr;
        }
        const hourAndMins = time.split(":");
        const h = lp(parseInt(hourAndMins[0], 10) + (pm ? 12 : 0), 2, "0");
        const m = lp(hourAndMins[1], 2, "0");
        return h + ":" + m;
    }

    extractAlterationInfoData(alterationEl) {
        const $ = this.$;
        const $el = $(alterationEl);
        const dateEls = $el.find(".alterationDate").toArray();
        return dateEls.map(dateEl => {
            const $date = $(dateEl);
            return {
                date: $date.html(),
                message: $date.next().html(),
            };
        });
    }

    extractTimetableItemData(timetableItemEl) {
        const $el = this.$(timetableItemEl);

        const $startTime = $el.find(".itemStartTime");
        const startTime = this.normaliseTime($startTime.html().trim());
        const endTime = this.normaliseTime(($startTime[0].nextSibling.nodeValue || "").trim());

        const $description = $el.find(".itemDescription");
        const room = ($description[0].nextSibling.nodeValue || "").trim();
        const alterationEl = $el.find(".alterationInfo").toArray()[0];
        const alterations = alterationEl ? this.extractAlterationInfoData(alterationEl) : [];

        return {
            venueId: $el.attr("data-venueid").trim(),
            startTime,
            endTime,
            description: $description.html().trim(),
            room,
            alterations,
            toString() {
                return this.venueId + ", " + this.startTime + ", " + this.endTime + ", " + this.description + ", " + this.room;
            },
        };
    }

    extractTimetableDayGroupData(timetableDayGroupEl) {
        const $el = this.$(timetableDayGroupEl);
        const timetableItemElArr = $el.find(".timetableItem").toArray();
        const id = $el.attr("id");
        const day = /timetableItemsDay-(\d+)/.exec(id)[1];
        const dayIdx = parseInt(day, 10);
        const items = timetableItemElArr.map(this.extractTimetableItemData.bind(this));
        return {
            day: dayIdx,
            items,
            toString() {
                return this.day + ", " + this.items.join("\n");
            },
        };
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;
        const timetableDayGroupElArr = $el.find(".timetableDayGroup").toArray();
        return trace.stop("parse", timetableDayGroupElArr.map(this.extractTimetableDayGroupData.bind(this)));
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
