const cheerio = require("cheerio");
const Trace = require("../Trace");
const fixStr = require("../fixStr");
const makeDay = require("../ponds-forgev2/makeDay");

/**
 * Takes a HTML string like:
 *
 * `6.30am - 3.15pm: Lane (25m) Swimming<br />12.00pm - 1.00pm: Age UK&nbsp;(Session available to all Age UK card holders) <br />3,15pm - 4.00pm: Lane Swimming - Limited Availability<br />4.00pm - 9.30pm:<span>&nbsp;Lane (50m) Swimming - Limited Availability</span><br />7.30pm - 9.30pm: Swimfit&nbsp;`
 *
 * and splits it into lines based on `<BR>` tags, and strips out any other HTML tags from those lines.
 *
 * @param {CheerioStatic} $
 * @param {string} html
 *
 * @returns string[]
 */
function brLines($, html) {
    //console.log(">", html);

    // remove the <br> tags (<br>, <br/>, <br />, etc) before we strip all remaining tags from the string
    html = html.replace(/<br\s*\/?>/gi, "\n");
    //console.log(">", html);

    // hack to get rid of remaining html
    html = $("<div></div>").html(html).text();
    //console.log(">", html);

    html = html.replace(/\n|\r/gi, "\n");
    //console.log(">", html);

    const lines = html.split(/\n/gi);
    //console.log(">", lines);

    return lines.map((line) => line.trim()).filter((line) => line.length);
}


class TimetableParser {
    constructor($, $el) {
        this.$ = $;
        this.$el = $el;
    }

    dayNameToIndex(dayName) {
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
        const $ = this.$;
        const days = [];
        let dayIdx = -1;
        const laneSwimmingContent = $el.find("[id='laneswimming-content']");
        let h2 = laneSwimmingContent.find("h2");
        h2.each((idx, h2) => {
            h2 = $(h2);
            const dayName = fixStr(h2.text()).trim();
            //console.log(idx, dayName);
            const p = h2.next("p");
            //console.log(idx, p.html());
            if (!p || !p.length) {
                return;
            }
            const lines = brLines($, p.html());
            //console.log(idx, lines);
            dayIdx = this.dayNameToIndex(dayName);
            if (dayIdx > -1) {
                days.push(makeDay(dayIdx, lines));
            }
        });
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
        const $ = this.loadHtml(html);
        return TimetableParser.timetableFromElement($, $(":root"), opts);
    }

    static loadHtml(html) {
        // cheerio already turns '&nbsp;' into '&#xA0;'
        // use decodeEntities=false to turn '&nbsp;' into a space character
        return cheerio.load(html, {
            //withDomLvl1: true,
            //normalizeWhitespace: true,
            //xmlMode: false,
            decodeEntities: false,
        });
    }
}


TimetableParser.brLines = brLines;


module.exports = TimetableParser;
