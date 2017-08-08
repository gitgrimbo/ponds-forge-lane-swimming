class Timetable {
    static filterByVenueId(timetable, venueId) {
        return Object.assign({}, timetable, {
            days: timetable.days.map(day => {
                return Object.assign({}, day, {
                    items: day.items.filter(item => item.venueId === venueId),
                });
            }),
        });
    }

    static filterByDescription(timetable, reDescription) {
        return Object.assign({}, timetable, {
            days: timetable.days.map(day => {
                return Object.assign({}, day, {
                    items: day.items.filter(item => item.description.match(reDescription)),
                });
            }),
        });
    }
}

module.exports = Timetable;
