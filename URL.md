# gola URL endpoints

### Landing page

- `GET /` Index that page contains a button to create page.

### Poll creation

- `GET /create/` Shows poll creation UI.
- `POST /create/` Submits a new poll. On success, returns link to the ready page.
- `GET /ready/<poll_id>` Shows vote link and result link.

### Poll participation

- `GET /vote/<poll_id>` Shows poll participation UI.
- `GET /get/<poll_id>` Get poll content.
- `POST /vote/<poll_id>` Submits an answer.

### Poll result

- `GET /result/<poll_id>` Shows poll result.

