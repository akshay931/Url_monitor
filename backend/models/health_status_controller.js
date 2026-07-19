const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const normalizeUrl = require("../utils/utils").normalizeUrl;

async function checkUrl(url) {
  const target = normalizeUrl(url);
  try {
    const start = Date.now();
    const response = await axios.get(target, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    const responseTime = Date.now() - start;

    return {
      url: url,
      statusCode: response.status,
      responseTime,
      status: "UP",
      error: null,
      checkedAt: new Date(),
    };
  } catch (err) {
    return {
      url,
      statusCode: err.response?.status || "No Response",
      responseTime: null,
      status: "DOWN",
      error: err.message,
      checkedAt: new Date(),
    };
  }
}

module.exports = { checkUrl };
