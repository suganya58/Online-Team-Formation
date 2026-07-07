const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const Hackathon = require("../models/Hackathon");

router.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto("https://devfolio.co/hackathons", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

   const hackathons = await page.evaluate(() => {
  const titleElements = document.querySelectorAll("h3");

  return Array.from(titleElements).map((title) => ({
    title: title.innerText,
    organizer: "Devfolio",
    date: "Coming Soon",
    mode: "Online",
    participants: "Open",
    tags: ["Hackathon"],
    prize: "TBA",
    daysLeft: "Live Now",
  }));
});

    await browser.close();

console.log("Scraped:", hackathons.length);

console.log("Before delete");
await Hackathon.deleteMany({});

console.log("Before insert");
const inserted = await Hackathon.insertMany(hackathons);

console.log("Inserted:", inserted.length);

res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const hackathons = await Hackathon.find();

    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;