This Monitoring App is build using electron and ember.

It should be used to provide real time information without opening a bowser for
MOOC Admins and teachers.

The Basic architecture:

There is one main nodejs task. This will poll (later use websockets) for
notifications and a general state.

This will then decide to:
- Send native notifications
- color the icon
- Show alerts
- Maybe show content on a transparent setFullScreen

User settings:

The user can select the endpoint and set his user token


TODO:
- Login and store token in app
- Append token header to all API calls if user logged in
- Have a service that lets the user know if he is logged in or not
- Fix ember crash on window going fullscreen
- Auto Update
- Move Repo to github.com


Planed Content of the app:
 - Amount of active users
 - Geo stats
 - Amount of all users (needs permission)
 - Amount of all enrollments (needs permission)
 - Active users day / month / year
 - popular courses
 - next dates (needs login)

 We could think about publishing this for all users with a smaller set of functions
