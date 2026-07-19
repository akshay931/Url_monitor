const fs = require("node:fs").promises;
const path = require("path");
const url_path = path.join(__dirname, "../database", "db.json");

const StoreRecord = async (urlRecord) => {
  try {
    try {
      await fs.access(url_path);
    } catch {
      await fs.writeFile(url_path, "[]");
    }

    const rawData = await fs.readFile(url_path, "utf8");
    const data = JSON.parse(rawData);

    data.push({
      checkedAt: new Date().toISOString(),
      status: urlRecord,
    });

    await fs.writeFile(url_path, JSON.stringify(data, null, 4));
  } catch (err) {
    console.error("Operation failed:", err);
  }
};

module.exports = { StoreRecord };
