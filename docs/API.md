# TaskFlow API

Base URL: `/api`

All protected routes require:

```http
Authorization: Bearer <jwt>
```

Responses follow:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {}
}
```

## Auth

### Signup

`POST /auth/signup`

```json
{
  "name": "Avery Chen",
  "email": "avery@example.com",
  "password": "Password123!",
  "role": "admin"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "admin@taskflow.app",
  "password": "Password123!"
}
```

### Current User

`GET /auth/me`

## Users

`GET /users?q=maya` admin only.

`PATCH /users/me`

```json
{
  "name": "Maya Patel",
  "title": "Frontend Engineer",
  "avatar": "https://example.com/avatar.png"
}
```

## Projects

`GET /projects?page=1&limit=12&q=launch&priority=urgent`

`POST /projects` admin only.

```json
{
  "name": "Launch Command Center",
  "description": "Coordinate beta launch.",
  "priority": "urgent",
  "dueDate": "2026-06-15",
  "color": "#22d3ee"
}
```

`GET /projects/:id`

`PATCH /projects/:id` admin only.

`DELETE /projects/:id` admin only, archives the project.

`POST /projects/:id/members` admin only.

```json
{
  "email": "maya@taskflow.app",
  "role": "contributor"
}
```

## Tasks

`GET /tasks?project=<projectId>&status=todo&q=design`

`POST /tasks` admin only.

```json
{
  "title": "Audit RBAC edge cases",
  "description": "Review member transitions.",
  "project": "<projectId>",
  "assignee": "<userId>",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-06-01",
  "labels": ["security"]
}
```

`PATCH /tasks/:id`

```json
{
  "status": "completed"
}
```

`PATCH /tasks/reorder`

```json
{
  "projectId": "<projectId>",
  "tasks": [
    { "id": "<taskId>", "status": "todo", "order": 0 }
  ]
}
```

`DELETE /tasks/:id` admin only.

`GET /tasks/:id/comments`

`POST /tasks/:id/comments`

```json
{
  "body": "Latest design pass is attached."
}
```

`POST /tasks/:id/attachments` multipart form field `file`.

## Dashboard

`GET /dashboard`

Returns stats, productivity chart data, recent projects, team members, and activity.

## Notifications

`GET /notifications`

`PATCH /notifications/read`

```json
{
  "ids": ["<notificationId>"]
}
```

## Realtime Events

Socket URL: backend origin, authenticated with:

```js
io(SOCKET_URL, { auth: { token } })
```

Client emits:

- `project:join`
- `project:leave`

Server emits:

- `notification:new`
- `project:updated`
- `project:deleted`
- `task:created`
- `task:updated`
- `task:reordered`
- `task:deleted`
- `comment:created`
