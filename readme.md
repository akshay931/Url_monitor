# URL Health Monitor

A lightweight **URL Health Monitoring** application built with **Node.js, Express, WebSocket, Axios, and Docker**. The application periodically checks the health of registered URLs and updates the frontend in real time using WebSockets.

## Features

- Real-time URL health monitoring
- Live updates using WebSockets
- Register new URLs without refreshing the page
- Periodic health checks
- Displays:
  - URL
  - Status (UP/DOWN)
  - HTTP Status Code
  - Response Time
  - Error Message

- Stores monitoring history in JSON format
- Simple frontend built with HTML and JavaScript
- REST API for URL management
- Docker and Docker Compose support

---

# Project Structure

```text
project/
│
├── backend/
│   ├── database/
│   │   ├── db.json
│   │   └── urls.json
│   │
│   ├── models/
│   │   ├── db_store_controller.js
│   │   ├── health_status_controller.js
│   │   └── url_store_controller.js
│   │
│   ├── routes/
│   │   └── url_routes.js
│   │
│   ├── utils/
│   │   └── utils.js
│   │
│   ├── .env
│   ├── app.js
│   └── web_socket_server.js
│
├── frontend/
│   ├── index.html
│   └── scripts.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Technologies Used

## Backend

- Node.js
- Express.js
- Axios
- WebSocket (ws)

## Frontend

- HTML
- JavaScript

## Storage

- JSON Files
  - `urls.json`
  - `db.json`

## DevOps

- Docker
- Docker Compose

---

# How It Works

1. The frontend loads all registered URLs from the backend.
2. A WebSocket connection is established.
3. The backend periodically reads all URLs from `urls.json`.
4. Each URL is checked using an HTTP request.
5. Response time and HTTP status are collected.
6. Results are broadcast to all connected clients using WebSockets.
7. The frontend updates the corresponding table row automatically.
8. Every monitoring cycle is stored in `db.json`.

---

# Monitoring Flow

```text
               +------------------+
               |   urls.json      |
               +------------------+
                        |
                        v
               Read Registered URLs
                        |
                        v
             Perform Health Check
                 (Axios Request)
                        |
                        v
          Collect Status & Response Time
                        |
          +-------------+-------------+
          |                           |
          v                           v
 Broadcast via WebSocket      Save History
      to Frontend             to db.json
          |                           |
          +-------------+-------------+
                        |
                        v
             Update UI in Real Time
```

---

# API Endpoints

## Get All Registered URLs

**Request**

```http
GET /api/url
```

**Response**

```json
["https://google.com", "https://github.com"]
```

---

## Register a New URL

**Request**

```http
POST /api/url/register
```

**Request Body**

```json
{
  "url": "https://openai.com"
}
```

**Response**

```json
{
  "message": "URL added successfully"
}
```

---

# WebSocket

A WebSocket connection is established when the frontend loads.

The server continuously broadcasts health updates to all connected clients.

Example message:

```json
{
  "url": "https://google.com",
  "status": "UP",
  "statusCode": 200,
  "responseTime": 84,
  "error": null
}
```

The frontend updates the corresponding table row instantly without requiring a page refresh.

---

# Monitoring History

Each monitoring cycle is stored in `db.json`.

Example:

```json
[
  {
    "checkedAt": "2026-07-19T07:26:54.182Z",
    "status": [
      {
        "url": "https://google.com",
        "status": "UP",
        "statusCode": 200,
        "responseTime": 78,
        "error": null
      },
      {
        "url": "https://invalid-url.com",
        "status": "DOWN",
        "statusCode": "No Response",
        "responseTime": null,
        "error": "Request failed"
      }
    ]
  }
]
```

---

# Frontend Features

The frontend displays:

- URL
- Current Status
- HTTP Status Code
- Response Time
- Error Message
- WebSocket Connection Status
- Refresh Counter
- Add URL Form

New URLs appear automatically without refreshing the page.

---

# Error Handling

The application handles:

- Invalid URLs
- Connection refused
- Timeout errors
- HTTP error responses
- WebSocket disconnections
- File read/write errors

---

# Configuration

The monitoring interval can be modified in:

```
backend/web_socket_server.js
```

Example:

```javascript
setInterval(async () => {
  // Perform health checks
}, 5000);
```

---

# Docker Support

The project can be run using Docker and Docker Compose.

## Build the Docker image

```bash
docker compose build
```

## Start the application

```bash
docker compose up
```

Run in detached mode:

```bash
docker compose up -d
```

## Stop the application

```bash
docker compose down
```

The application will be available at:

```
http://localhost:3000
```

The `backend/database` directory can be mounted as a Docker volume so that `urls.json` and `db.json` persist across container restarts.

---

# Future Improvements

- Delete registered URLs
- Edit existing URLs
- Pause/Resume monitoring
- Configurable polling interval
- Search and filter URLs
- Dashboard with charts
- Authentication
- MongoDB or PostgreSQL storage
- Email or Slack notifications
- Historical analytics
- Export monitoring reports (CSV/PDF)

---

# Author

**Akshay Vadher**

Backend Developer

---

# License

This project is licensed under the MIT License.
