const lp = require("left-pad");

/**
 * Most Ponds Forge times are in the format "6:30am", but some are "6.30am", and some are unfortunately "6,30am".
 *
 * @param {string} str
 *
 * @returns {string[]}
 */
function strToHoursAndMins(str) {
    const trySplittingOn = [":", "."];
    for (const splitOn of trySplittingOn) {
        const hourAndMins = str.split(splitOn);
        if (!hourAndMins || hourAndMins.length === 2) {
            return hourAndMins;
        }
    }
    return [str, ""];
}

/**
 * Returns a string of the form "00:00".
 *
 * @param {string} timeStr
 *
 * @returns {string}
 */
function normaliseTime(timeStr) {
    const exec = /(.*)(am|pm)/.exec(timeStr);
    const pm = exec[2] === "pm";
    const time = (exec[1] || "").trim();
    if (!time) {
        return timeStr;
    }
    const hourAndMins = strToHoursAndMins(time);
    let h = parseInt(hourAndMins[0], 10);
    if (pm && h < 12) {
        h += 12;
    }
    h = lp(h, 2, "0");
    const m = lp(hourAndMins[1], 2, "0");
    return h + ":" + m;
};

module.exports = normaliseTime;
