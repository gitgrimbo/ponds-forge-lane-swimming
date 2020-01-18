const { expect } = require("chai");

const { newTimetableItem, expectTimetableItem } = require("./utils");
const makeDay = require("../makeDay");

describe("ponds-forgev2/makeDay", () => {
    it("Item ending with spaces and full-stops shows no alterations", () => {
        const input = "6:30am - 3:15pm: 25 Metre Lane Swimming . ";
        const day = makeDay(0, [input]);
        expect(day).to.be.an("object");
        expect(day.day).to.equal(0);
        expect(day.items).to.have.lengthOf(1);
        expectTimetableItem(day.items[0], newTimetableItem("1", "06:30", "15:15", "Lane (25m) Swimming", "Competition Pool", []));
    });
});
