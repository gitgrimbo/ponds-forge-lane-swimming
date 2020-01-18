/**
 * Used by Ponds Forge parser V2 and V3.
 */

const normaliseTime = require("../ponds-forge/normaliseTime");
const fixStr = require("../fixStr");

function makeDay(dayIdx, lines) {
  function newItem() {
    return {
      venueId: "1",
      startTime: "?",
      endTime: "?",
      room: "",
      description: "",
      alterations: [],
    };
  }

  function fixAlteration(s) {
    if (!s) {
      return s;
    }

    // Sometimes the alteration passed here has spaces and full-stops.
    // E.g., from the following string
    // "6:30am - 3:15pm: 25 Metre Lane Swimming . "
    // we will be passed " . ", which isn't a genuine alteration.
    let len;
    do {
      len = s.length;
      s = s.trim().replace(/^\./, "");
    } while (len !== s.length);

    return s;
  }

  function handleTimetableLine(startTime, endTime, description) {
    item.startTime = normaliseTime(startTime);
    item.endTime = normaliseTime(endTime);
    item.description = description;
    // Default to "Competition Pool" as we should be parsing the competition pool timetable.
    item.room = "Competition Pool";

    function update(description, room, alteration) {
      alteration = fixAlteration(alteration);

      item.description = description;
      item.room = room;
      if (alteration) {
        const match = alteration.match(/^\s*-\s*(.*)/);
        if (match) {
          alteration = match[1];
        }
        if (!alteration.match(/see below/i)) {
          item.alterations.push({
            message: alteration,
          });
        }
      }
    }

    let match;

    // E.g. "Lane (25m) Swimming"
    match = item.description.match(/^(Lane \(\d\dm\) )(in Diving Pool)(.*)/);
    if (match) {
      return update(match[1].trim() + " Swimming", "Diving Pool", match[3].trim());
    }

    // E.g. "Lane (25m) Swimming"
    match = item.description.match(/^(Lane \(\d+m\) Swimming)(.*)/);
    if (match) {
      return update(match[1].trim(), "Competition Pool", match[2].trim());
    }

    // E.g. "25 Metre Lane Swimming"
    match = item.description.match(/^(\d+) Metre Lane Swimming(.*)/);
    if (match) {
      return update(`Lane (${match[1].trim()}m) Swimming`, "Competition Pool", match[2].trim());
    }

    match = item.description.match(/(.*?) ?-? ?Limited Availability(.*)/);
    if (match) {
      description = match[1].trim();
      if (description === "Lane") {
        description = "Lane Swimming";
      }
      return update(description, "Competition Pool", match[2].trim());
    }

    match = item.description.match(/(Lane Swimming) \(Limited Lanes Available\)(.*)/);
    if (match) {
      return update(match[1].trim(), "Competition Pool", match[2].trim());
    }

    match = item.description.match(/(.*)(Alterations.*)/);
    if (match) {
      return update(match[1].trim(), "Competition Pool", match[2].trim());
    }
  }

  const items = [];
  let item;
  let expectingAlteration = false;

  // Not session-specific
  let generalAlterations = [];

  lines.forEach((line) => {
    // ensure all weird whitespace is converted to regular spaces.
    // and then trim, as line could have started and/or ended with weird whitespace
    // (but now converted to regular space).
    line = fixStr(line).trim();

    if (!item) {
      item = newItem();
    }

    // Check for these and ignore if matches.
    // The real alterations will come on subsequent lines.
    if (line.match(/^(Changes|Alterations|Limited Availability)/)) {
      return expectingAlteration = true;
    }

    // Only add non-empty lines.
    if (expectingAlteration && line) {
      generalAlterations.push({
        message: line,
      });
      return;
    }

    const lineStartsWithDigit = line.match(/^\d/);
    if (lineStartsWithDigit) {
      // assume the digit was part of the activity start time.
      expectingAlteration = false;
      item = newItem();
      items.push(item);
      const match = line.match(/^([^\s]+)\s*-\s*([^\s]+): (.*)/);
      if (match) {
        const [_, startTime, endTime, description] = match;
        handleTimetableLine(startTime, endTime, description);
      }
      return;
    }

    // we weren't expecting an alteration, but we couldn't parse the line, so assume alteration
    generalAlterations.push({
      message: line,
    });

    // one last check if any part of the line might be related to Lane Swimming
    const isLaneSwimmingRelated = Boolean(line.match(/Lane Swimming/));
    if (isLaneSwimmingRelated) {
      item.description = "Lane Swimming";
      items.push(item);
    }
  });

  // remove empty messages
  generalAlterations = generalAlterations.filter(({ message }) => !!message);

  if (items.length > 0) {
    // expected
    if (generalAlterations.length > 0) {
      items.forEach((item) => {
        item.alterations = item.alterations.concat(generalAlterations);
      });
    }
  } else {
    // Special case. What we should expect as item data is actually embedded in one big general alteration.
    const item = Object.assign(newItem(), {
      alterations: generalAlterations.slice(),
    });
    items.push(item);
  }

  return {
    day: dayIdx,
    items,
  };
}

module.exports = makeDay;
