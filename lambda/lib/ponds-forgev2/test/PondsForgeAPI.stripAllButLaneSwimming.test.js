const { expect } = require("chai");
const path = require("path");

const loadJSON = require("../../test/loadJSON");
const PondsForgeAPI = require("../PondsForgeAPI");

describe("ponds-forgev2/PondsForgeAPI.stripAllButLaneSwimming", () => {
    it("", () => {
        const fullTimetable = loadJSON(path.join(__dirname, "./full-ponds-forge-timetable.json"));

        const { name, timetable } = fullTimetable[0];
        expect(name).to.equal("Regular");

        const filtered = PondsForgeAPI.stripAllButLaneSwimming(timetable);

        // filter should preseve length
        expect(filtered).to.have.lengthOf(timetable.length);

        // check the lengths of the items in each day's timetable.
        // we check both the original timetable (non-filtered)
        // and the filtered timetable.
        const expectedOriginalItemsLengths = [4, 4, 3, 5, 5, 1, 1];
        const originalItemsLengths = timetable.map(({ items }) => items.length);
        expect(originalItemsLengths, "originalItemsLengths").to.deep.equal(expectedOriginalItemsLengths);

        const expectedFilteredItemsLengths = [2, 3, 3, 3, 3, 1, 1];
        const filteredItemsLengths = filtered.map(({ items }) => items.length);
        expect(filteredItemsLengths, "filteredItemsLengths").to.deep.equal(expectedFilteredItemsLengths);
    });
});
