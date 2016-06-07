# gola URL endpoints

### Landing page

- `GET /` Index that page contains a button to create page.

### Poll creation

- `GET /create/` Shows poll creation UI.
- `POST /create/` Submits a new poll. On success, returns link to the ready page.
- `GET /ready/<poll_id>` Shows vote link and result link.

### Poll participation

- `GET /vote/<poll_id>` Shows poll participation UI.
- `POST /vote/<poll_id>` Submits an answer.
- `GET /get/<poll_id>` Get poll content.

```js
// get output example
{ "title": "aaa",
  "vote_count": 3,
  "questions": [
    { "text": "aaaaaaaa?",
      "type": "text",
      "options": [{"count": 3, "text": "1111111"}, {"count": 3, "text": "2222222"}, {"count": 0, "text": "3333333"}]
    }
  ],
  "noti_email": "aaa@bbb.com",
  "noti_count": 5 }
```

### Poll result

- `GET /result/<poll_id>` Shows poll result.
- `GET /result_data/<poll_id>` Fetches result.

```js
// result_data output example
{ "results": [
    {"answers": [ {"total": 3}, {"total": 3}, {"total": 0} ] }
  ],
  "pollID": "5755c310bca56655f5b5d6d2",
  "participantNum": 3 }
```

