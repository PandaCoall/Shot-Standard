# Shot Standard API (n8n)

Public HTTP API on the same host as the desk.

## Find it

```
GET /api
GET /api/health
```

## Write a plate

```
POST /api/generate
Content-Type: application/json
```

Send **one** of:

```json
{ "imageUrl": "https://example.com/still.jpg" }
```

```json
{ "image": "data:image/jpeg;base64,/9j/..." }
```

Raw base64 (no data-URL prefix) is also accepted in `image`.

Success:

```json
{ "ok": true, "plate": "[SCENE]\n...\n\n[SUBJECT]\n[Man]\n..." }
```

Error:

```json
{ "ok": false, "error": "..." }
```

## n8n

1. Node: **HTTP Request**
2. Method: `POST`
3. URL: `https://YOUR-HOST/api/generate`
4. Body: JSON
   - `imageUrl` = public URL of the still, or
   - `image` = binary converted to base64
5. Timeout: at least 90 seconds
6. If the server has `SHOT_API_KEY` set, add header `x-api-key`

Optional first node: `GET https://YOUR-HOST/api/health` to confirm the app is up.

This is not an official n8n app node. Wire it with HTTP Request.
