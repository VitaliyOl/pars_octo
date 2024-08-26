const express = require("express");
const cors = require("cors");
const { fetchSteamData } = require("./services/pupet");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/", (req, res) => {
  res.send("Hello from Puppeteer!");
});

app.get("/steamdata/:appid", async (req, res) => {
  const { appid } = req.params;
  try {
    await delay(2000);
    const result = await fetchSteamData(appid);
    res.json(result);
  } catch (error) {
    console.error("Error fetching Steam data:", error.message);
    res.status(500).json({ error: "Error fetching Steam data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
