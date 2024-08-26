const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const isDocker = process.env.IS_DOCKER === "true";

const fetchSteamData = async (appid) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: isDocker
        ? "/usr/bin/google-chrome"
        : puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`https://steamdb.info/app/${appid}/charts/`, {
      waitUntil: "load",
    });

    console.log("Page loaded successfully");

    // Store Data
    const storeData = await page.evaluate(() => {
      const storeDataElement = document.querySelector(
        ".row.row-app-charts .span4:nth-child(1) .app-chart-numbers"
      );
      return storeDataElement
        ? {
            followers:
              storeDataElement.querySelector("li:nth-child(1) strong")
                ?.innerText || "N/A",
            topSellers:
              storeDataElement.querySelector("li:nth-child(2) strong")
                ?.innerText || "N/A",
            positiveReviews:
              storeDataElement.querySelector("li:nth-child(3) strong")
                ?.innerText || "N/A",
            negativeReviews:
              storeDataElement.querySelector("li:nth-child(4) strong")
                ?.innerText || "N/A",
            positivePercentage:
              storeDataElement.querySelector("li:nth-child(5) strong")
                ?.innerText || "N/A",
          }
        : {
            followers: "N/A",
            topSellers: "N/A",
            positiveReviews: "N/A",
            negativeReviews: "N/A",
            positivePercentage: "N/A",
          };
    });

    // Twitch Stats Data
    const twitchData = await page.evaluate(() => {
      const twitchDataElement = document.querySelector(
        ".row.row-app-charts .span4:nth-child(2) .app-chart-numbers"
      );
      return twitchDataElement
        ? {
            twitchViewers:
              twitchDataElement.querySelector("li:nth-child(1) strong")
                ?.innerText || "N/A",
            twitchPeak24:
              twitchDataElement.querySelector("li:nth-child(2) strong")
                ?.innerText || "N/A",
            twitchAllTimePeak:
              twitchDataElement.querySelector("li:nth-child(3) strong")
                ?.innerText || "N/A",
          }
        : {
            twitchViewers: "N/A",
            twitchPeak24: "N/A",
            twitchAllTimePeak: "N/A",
          };
    });

    // Owner Estimations Data
    const ownerData = await page.evaluate(() => {
      const ownerDataElement = document.querySelector(
        ".row.row-app-charts .span4:nth-child(3) .app-chart-numbers"
      );
      return ownerDataElement
        ? {
            ownerVG:
              ownerDataElement.querySelector("li:nth-child(1) strong")
                ?.innerText || "N/A",
            ownerGamalytic:
              ownerDataElement.querySelector("li:nth-child(2) strong")
                ?.innerText || "N/A",
            ownerPlayTracker:
              ownerDataElement.querySelector("li:nth-child(3) strong")
                ?.innerText || "N/A",
          }
        : {
            ownerVG: "N/A",
            ownerGamalytic: "N/A",
            ownerPlayTracker: "N/A",
          };
    });

    // Steam Charts Data
    const steamCharts = await page.evaluate(() => {
      const steamChartsElement = document.querySelector(
        ".app-chart-numbers-big"
      );
      return steamChartsElement
        ? {
            playersNow:
              steamChartsElement.querySelector("li:nth-child(2) strong")
                ?.innerText || "N/A",
            peak24:
              steamChartsElement.querySelector("li:nth-child(3) strong")
                ?.innerText || "N/A",
            allTimePeak:
              steamChartsElement.querySelector("li:nth-child(4) strong")
                ?.innerText || "N/A",
          }
        : {
            playersNow: "N/A",
            peak24: "N/A",
            allTimePeak: "N/A",
          };
    });

    await browser.close();

    return {
      storeData,
      twitchData,
      ownerData,
      steamCharts,
    };
  } catch (error) {
    console.error("Error fetching Steam data:", error.message);
    throw new Error("Failed to fetch Steam data.");
  }
};

module.exports = { fetchSteamData };
