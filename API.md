# Shot Standard API (n8n)

Public HTTP API on the same host as the desk.

Grok 4.5 looks at the still and writes a MiniMax plate in the training-guide format.

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

## n8n

1. HTTP Request → `POST` `/api/generate`
2. JSON body: `imageUrl` or `image`
3. Timeout: at least 90 seconds
4. Plate is `{{ $json.plate }}`
5. Header `x-api-key` only if `SHOT_API_KEY` is set on the server
