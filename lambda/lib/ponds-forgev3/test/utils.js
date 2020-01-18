const { expect } = require("chai");

function expectTimetableItem(item, expected) {
    const equals = (expected, actual) => expect(actual).to.equal(expected);
    expect(item).to.be.an("object");
    equals(expected.venueId, item.venueId);
    equals(expected.startTime, item.startTime);
    equals(expected.endTime, item.endTime);
    equals(expected.description, item.description);
    equals(expected.room, item.room);
    if (expected.alterations) {
        expect(item.alterations, "alterations[]").to.have.lengthOf(expected.alterations.length);
        item.alterations.forEach((alteration, i) => {
            expect(alteration, "alteration").to.be.an("object");
            expect(alteration.message, "alteration.message").to.equal(expected.alterations[i].message);
        });
    }
}

function newTimetableItem(venueId, startTime, endTime, description, room, alterations) {
    return {
        venueId,
        startTime,
        endTime,
        description,
        room,
        alterations,
    };
}

function newAlterations(messages) {
    return messages.map((message) => ({
        message,
    }));
}

module.exports = {
    expectTimetableItem,
    newAlterations,
    newTimetableItem,
};
