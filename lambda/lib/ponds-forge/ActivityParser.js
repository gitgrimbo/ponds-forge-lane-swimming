const cheerio = require("cheerio");
const TimetableParser = require("./TimetableParser");
const Trace = require("../Trace");

/**
 * PFLS = Ponds Forge Lane Swimming.
 */
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

    /**
     * The PFLS html page can have a default timetable or links to timetables. Links are usually
     * present when there are two timetables side-by-side like at half term holidays.
     */
    extractDefaultTimetable() {
        const $timetablePlaceholder = this.$el.find("#timetablePlaceholder");
        const html = $timetablePlaceholder.html().trim();
        if (!html) {
            return null;
        }
        return TimetableParser.timetableFromHTML(html);
    }

    parse(opts) {
        opts = opts || {};
        const trace = Trace.start(opts.trace);

        const $ = this.$;
        const $el = this.$el;

        const venueElArr = $el.find("a[data-venueid]").toArray();
        const venues = venueElArr.map(this.extractVenueData.bind(this));

        return trace.stop("parse", {
            timetables: this.extractTimetables(),
            defaultTimetable: this.extractDefaultTimetable(),
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
