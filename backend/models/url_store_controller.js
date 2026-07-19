const fs = require("node:fs").promises;
const url_path = "./database/urls.json";

const addUrl = async (url) => {
  try {
    const rawData = await fs.readFile(url_path, "utf8");
    const data = JSON.parse(rawData);
    data.push(url);

    await fs.writeFile(url_path, JSON.stringify(data, null, 4));
  } catch (err) {
    console.error("Operation failed:", err);
  }
};

module.exports = { addUrl };
