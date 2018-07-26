const lp = require("left-pad");

module.exports = function normaliseTime(timeStr) {
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
};
