# URL Health Monitor

A lightweight **URL Health Monitoring** application built with **Node.js, Express, WebSocket, Axios, and Docker**. The application periodically checks the health of registered URLs and updates the frontend in real time using WebSockets.

# Live demo (deployed on Render)

### https://url-monitor-fsw7.onrender.com

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

## Testing Steps

Follow the steps below to verify that the application correctly detects both **UP** and **DOWN** states in real time.

### 1. Start the URL Health Monitor

Launch the application using Docker (or run it locally).

```bash
docker compose up
```

### 2. Create a Test Server

Duplicate `backend/app.js` and save it as `backend/app-test.js`.

Change the port to **3001** (or any unused port):

```javascript
const PORT = 3001;
```

Start the test server:

```bash
node backend/app-test.js
```

### 3. Register the Test URL

Add the following URL using either:

- the **Add URL** form in the top-right corner of the dashboard, or
- by appending it directly to `backend/database/urls.json`.

```
http://127.0.0.1:3001
```

A new row will be added to the monitoring table automatically, and within the next polling cycle its status should change to:

```
Status: UP
```

No page refresh is required.

### 4. Verify the DOWN State

Stop the test server:

```bash
Ctrl + C
```

Within the next monitoring interval, the dashboard will automatically update the same URL to:

```
Status: DOWN
```

This confirms that:

- URL health checks are performed periodically.
- Status changes are detected automatically.
- WebSocket updates are pushed to the frontend in real time.
- No manual page refresh is required.

#

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

# A 1-Line Setup:

```bash
docker compose up
```
# Deployment Sketch

## Current MVP Deployment

The application is currently deployed on **Render** as a single Node.js web service.

The Express application serves:

- Static frontend (`index.html`, `scripts.js`)
- REST API endpoints
- WebSocket server
- URL health monitoring service

Monitoring data is currently stored in JSON files (`urls.json` and `db.json`) for simplicity.

### High-Level Architecture

```text
                        +----------------------+
                        |      Web Browser     |
                        +----------+-----------+
                                   |
                              HTTP / WebSocket
                                   |
                                   v
                 +------------------------------------+
                 |          Render Web Service        |
                 |------------------------------------|
                 |                                    |
                 |  Express.js Application            |
                 |                                    |
                 |  +------------------------------+  |
                 |  | Static Frontend             |  |
                 |  | index.html                 |  |
                 |  | scripts.js                 |  |
                 |  +------------------------------+  |
                 |                                    |
                 |  +------------------------------+  |
                 |  | REST API                    |  |
                 |  | GET /api/url               |  |
                 |  | POST /api/url/register     |  |
                 |  +------------------------------+  |
                 |                                    |
                 |  +------------------------------+  |
                 |  | WebSocket Server            |  |
                 |  | Real-time Status Updates    |  |
                 |  +------------------------------+  |
                 |                                    |
                 |  +------------------------------+  |
                 |  | Health Check Service         |  |
                 |  | Axios Polling               |  |
                 |  +------------------------------+  |
                 |                                    |
                 |        backend/database/           |
                 |   urls.json      db.json           |
                 +------------------------------------+
```

---

# Future Cloud Deployment

For a production-ready deployment, I would separate the application into managed cloud services.

```text
                    +----------------------+
                    |      Web Browser     |
                    +----------+-----------+
                               |
                          HTTPS / WSS
                               |
                               v
                   +------------------------+
                   |  Cloud Load Balancer   |
                   +-----------+------------+
                               |
                               v
                 +-------------------------------+
                 |   Dockerized Node.js App      |
                 |-------------------------------|
                 | Express API                   |
                 | Static Frontend               |
                 | WebSocket Server              |
                 | Health Monitoring Service     |
                 +---------------+---------------+
                                 |
                +----------------+----------------+
                |                                 |
                v                                 v
      +---------------------+          +----------------------+
      | PostgreSQL/MongoDB  |          | Object Storage       |
      | Registered URLs     |          | Monitoring History   |
      +---------------------+          +----------------------+
```
## Infrastructure-as-Code (Hypothetical)

If deployed on AWS, the infrastructure could be provisioned using Terraform.

```hcl
provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "url_monitor" {
  ami           = "ami-xxxxxxxx"
  instance_type = "t3.micro"

  tags = {
    Name = "url-health-monitor"
  }
}
```

The application Docker image would be deployed to the EC2 instance, with:

- Docker running the Node.js application
- Nginx acting as a reverse proxy
- HTTPS enabled using Let's Encrypt
- Monitoring data stored in PostgreSQL or MongoDB instead of JSON files

In a production cloud environment, the JSON files would be replaced by a managed PostgreSQL or MongoDB database, Docker images would be deployed automatically through a CI/CD pipeline, and HTTPS would be provided by the cloud platform.
## Deployment Notes

For a production deployment, I would:

- Build a Docker image using GitHub Actions.
- Push the image to Docker Hub or GitHub Container Registry.
- Provision infrastructure using Terraform.
- Deploy the container to AWS EC2, ECS, or Google Cloud Run.
- Store monitoring data in PostgreSQL or MongoDB.
- Configure HTTPS using a cloud load balancer or Nginx.
- Use CloudWatch or Prometheus/Grafana for monitoring and logging.
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
