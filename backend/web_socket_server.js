const axios = require("axios");
const fs = require("fs").promises;
const dotenv = require("dotenv");
const path = require("path");
const { StoreRecord } = require("./models/db_store_controller");
const { checkUrl } = require("./models/health_status_controller");

const { init, broadcast } = require("./utils/utils");
// const urlPath = "./database/urls.json";
const urlPath = path.join(__dirname, "database", "urls.json");
dotenv.config();

const checkAllUrl = async (Store) => {
  try {
    const urls = await fs.readFile(urlPath, "utf8");
    const parsedUrls = JSON.parse(urls);

    await Promise.allSettled(
      parsedUrls.map(async (url) => {
        const response = await checkUrl(url);
        broadcast(response);
        Store.push(response);
      }),
    );
    StoreRecord(Store);
    broadcast({ type: "checking" });
  } catch (err) {
    console.error("WebSocket polling error:", err.message);
    broadcast({
      type: "error",
      message: "Unable to read urls.json or parse data",
    });
  }
};
async function setupWebSocket(wss) {
  init(wss);
  let Store = [];
  checkAllUrl(Store);
  setInterval(async () => {
    Store = [];
    checkAllUrl(Store);
  }, 2000);
}

module.exports = { setupWebSocket };
