const WebSocket = require("ws");
let wss;
let lastResults = [];

function normalizeUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return "http://" + url;
}

function init(webSocketServer) {
  wss = webSocketServer;

  wss.on("connection", (client) => {
    lastResults.forEach((data) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
}

function broadcast(data) {
  if (!wss) return;

  if (data.url) {
    const idx = lastResults.findIndex((r) => r.url === data.url);
    if (idx >= 0) lastResults[idx] = data;
    else lastResults.push(data);
  }

  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;
    try {
      client.send(JSON.stringify(data));
    } catch (err) {
      console.error("WebSocket broadcast failed:", err.message);
    }
  });
}

module.exports = { normalizeUrl, broadcast, init };
