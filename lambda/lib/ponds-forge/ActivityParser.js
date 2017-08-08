const cheerio = require("cheerio");
const Trace = require("../Trace");

class ActivityParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
    }

    extractVenueData(venueEl) {
        const $el = this.$(venueEl);
        const id = $el.attr("data-venueid");
        const name = $el.text().trim();
        return {
            id,
            name,
            toString() {
                return "Venue: id=" + this.id + ", name=" + this.name;
            },
        };
    }

    extractTimetables() {
        const timetableElArr = this.$el.find("*[data-timetable]").toArray();
        return timetableElArr.map(timetableEl => {
            const $el = this.$(timetableEl);
            return {
                id: $el.attr("data-timetable").trim(),
                name: $el.text().trim(),
                toString() {
                    return "Timetable: id=" + this.id + ", name=" + this.name;
                },
            };
        });
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;
        const venueElArr = $el.find("*[data-venueid]").toArray();
        const venues = venueElArr.map(this.extractVenueData.bind(this));
        return trace.stop("parse", {
            timetables: this.extractTimetables(),
            venues,
            toString() {
                return "venues:\n" + this.venues.join("\n") + "\ntimetables:\n" + this.timetables.join("\n");
            },
        });
    }

    static activityFromElement($, $el, opts) {
        return new ActivityParser($, $el).parse(opts);
    }

    static activityFromHTML(html, opts) {
        const $ = cheerio.load(html);
        return ActivityParser.activityFromElement($, $(":root"), opts);
    }
}

module.exports = ActivityParser;
