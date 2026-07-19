# AI_LOG.md

# AI Collaboration Log

This document summarizes how AI tools were used during the development of this project, the decisions made, and the lessons learned throughout the implementation.

---

# AI Tech Stack

The following AI tools were used during development:

- ChatGPT (GPT-5.5)
- GitHub Copilot (VS Code Chat)
- Google Gemini

Each tool was used for different purposes, including brainstorming, backend implementation, debugging, architecture discussions, and documentation.

---

# Development Journey

## 1. Choosing the Frontend

Initially, I was unsure whether to build the frontend using React or a simple static HTML page.

Since the assignment required an MVP and the frontend only needed to display monitoring results and receive WebSocket updates, I decided to keep it simple and use a static HTML/JavaScript frontend served through Express.

This reduced unnecessary complexity and allowed me to focus more on the backend implementation.

---

## 2. Designing the Project Structure

One of my first prompts to GitHub Copilot was to generate a project directory structure.

The initial suggestion contained many folders, services, configuration files, and abstractions that felt unnecessary for a small MVP.

Instead of following that structure directly, I simplified it significantly and ended up with a much smaller and easier-to-maintain project.

Final structure:

```text
backend/
    database/
    models/
    routes/
    utils/
    app.js
    web_socket_server.js

frontend/
    index.html
    scripts.js
```

This structure was sufficient for the assignment while remaining easy to understand.

---

# Prompts That Shaped the Project

Examples of prompts used during development include:

- "Generate a simple folder structure for a Node.js URL monitoring application."
- "Implement a WebSocket server that broadcasts URL health updates."
- "How should I organize Express routes and controllers?"
- "How can I dynamically update HTML using WebSockets?"
- "Generate a Docker Compose configuration for this application."
- "Create a professional README for this project."

These prompts were used as starting points rather than copied directly into the final implementation.

---

# Course Corrections

AI significantly accelerated development, but many generated solutions required refinement before they became production-ready.

## Simplifying the Architecture

The first suggested architecture was considerably more complex than necessary for the scope of this assignment.

I simplified the project by reducing unnecessary layers and keeping only the components required for the MVP.

---

## WebSocket Communication

While implementing WebSockets, I learned the difference between sending messages to a single client versus broadcasting to all connected clients.

For example:

- `ws.send()` sends data to a single connected client.
- Iterating through `wss.clients` and calling `client.send()` broadcasts updates to every connected client.

This understanding helped implement real-time monitoring correctly.

---

## Asynchronous Processing

During implementation, I initially used asynchronous iteration in a way that caused the "finished" event to be emitted before all URL checks had completed.

After debugging, I changed the implementation to wait for all monitoring requests before broadcasting the completion event.

---

## File Path Management

Initially I used hardcoded relative file paths.

Through AI discussions and debugging, I learned that using Node.js `path.join()` together with `__dirname` produces more reliable and portable file paths, especially when running inside Docker or from different working directories.

---

## Dynamic UI Updates

Instead of requiring the user to refresh the page after adding a new URL, I implemented:

- writing the URL into `urls.json`
- broadcasting the update through WebSockets
- dynamically adding the new row to the table

This allows new URLs to appear immediately without refreshing the browser.

---

# Development Focus

The project intentionally prioritizes backend engineering over frontend styling.

Most development effort was spent on:

- REST API design
- WebSocket communication
- Health monitoring logic
- Monitoring history
- Dynamic updates
- Error handling
- Dockerization
- Project documentation

The frontend was intentionally kept minimal because the primary objective of the assignment was demonstrating backend architecture and real-time communication.

---

# Key Learnings

During this project I improved my understanding of:

- Express application structure
- REST API design
- WebSocket communication
- Real-time frontend updates
- Broadcasting messages to multiple clients
- Asynchronous programming in Node.js
- Managing JSON-based persistence
- File path handling using `path.join()`
- Dockerizing a Node.js application
- Structuring a maintainable backend project

---

# Reflection

AI greatly accelerated development by helping generate initial implementations, explain unfamiliar concepts, and assist with debugging.

However, every generated solution was reviewed, simplified where necessary, and adapted to match the project requirements. Rather than accepting AI-generated code as-is, I treated it as a collaborative tool to explore alternatives, understand implementation details, and make informed engineering decisions.
