function filterItems(timetable, filter) {
    return timetable.map((day) => {
        return {
            ...day,
            items: day.items.filter(filter),
        };
    });
}

class Timetable {
    static filterByVenueId(timetable, venueId) {
        const filter = (item) => item.venueId === venueId;
        return filterItems(timetable, filter);
    }

    static filterByDescription(timetable, reDescription) {
        const filter = (item) => item.description && item.description.match(reDescription);
        return filterItems(timetable, filter);
    }
}

module.exports = Timetable;
