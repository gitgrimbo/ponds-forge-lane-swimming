# Ponds Forge v2

The main page:

https://www.siv.org.uk/page/swimming

Shows one or more links to the timetable page(s). E.g.:

- Summer School Holiday Timetable and Pricing (23rd July - 2nd September)
  - https://www.siv.org.uk/page/holiday-swimming-ponds-forge
- Term Time Timetable and Pricing (From 3rd September)
  - https://www.siv.org.uk/page/swimming-ponds-forge

It is not easy to work out the dates from these links, as it is all hand-written English.

So unlike *Ponds Forge v1*, we need to either parse the main page to find the links, or assume the only two links are
a holiday and non-holiday timetable, and fetch and parse both of these.

The `TimetableParser` is able to read regular and holiday timetable (the HTML of each is basically the same format).
