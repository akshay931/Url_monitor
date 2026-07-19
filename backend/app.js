const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const urlRoutes = require("./Routes/url_routes");
const WebSocket = require("ws");
const socket = require("./web_socket_server");

dotenv.config();
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(express.json());

app.use("/api", urlRoutes);

app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
const wss = new WebSocket.Server({ server });
socket.setupWebSocket(wss);
