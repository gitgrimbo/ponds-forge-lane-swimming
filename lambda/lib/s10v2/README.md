# S10API2

The main page:

https://www.sport-sheffield.com/timetables

Calls these three services:

- https://www.sport-sheffield.com/online/api/activities/resourcegroup/SP-TT?resource%5B%5D=POOL&groupbyname=false&start=2017-08-05&end=2017-08-12
- https://www.sport-sheffield.com/online/api/openingtimes/primary/simplified
- https://www.sport-sheffield.com/online/api/openingtimes/primary/isopen

The `/online/api/activities/resourcegroup/SP-TT` data is an array of timetable items. For example:

```json
[
    {
        "id": "0EE07BYXAPPYT8U",
        "groupId": "SP-TT",
        "title": "Lane Swimming",
        "icon": "heart1",
        "start": "2017-08-05T09:00:00",
        "end": "2017-08-05T16:00:00",
        "location": "Lane 1, Lane 2, Lane 3",
        "colour": "#f1f1f1",
        "description": "Lane Swimming"
    },
    ...
```
