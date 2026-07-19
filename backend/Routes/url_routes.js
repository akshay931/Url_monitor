const express = require("express");
const fs = require("fs").promises;

const urlStoreController = require("./../models/url_store_controller");
const healthStatusController = require("./../models/health_status_controller");
const urlPath = "./database/urls.json";

const router = express.Router();
const app = express();

app.use(express.json());

router.post("/url/register", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    await urlStoreController.addUrl(url);
    res.status(201).json({
      message: "URL added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add URL",
    });
  }
});

router.get("/url", async (req, res) => {
  try {
    const data = await fs.readFile(urlPath, "utf8");
    const urls = JSON.parse(data);

    res.json(urls);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
