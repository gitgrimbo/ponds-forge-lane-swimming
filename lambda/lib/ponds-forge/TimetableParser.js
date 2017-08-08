const cheerio = require("cheerio");
const Trace = require("../Trace");

class TimetableParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
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
        const endTime = ($startTime[0].nextSibling.nodeValue || "").trim();
        const $description = $el.find(".itemDescription");
        const room = ($description[0].nextSibling.nodeValue || "").trim();
        const alterationEl = $el.find(".alterationInfo").toArray()[0];
        const alterations = alterationEl ? this.extractAlterationInfoData(alterationEl) : [];
        return {
            venueId: $el.attr("data-venueid").trim(),
            startTime: $startTime.html().trim(),
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
        const items = timetableItemElArr.map(this.extractTimetableItemData.bind(this));
        return {
            day,
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
