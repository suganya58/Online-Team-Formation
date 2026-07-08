const puppeteer = require("puppeteer");

async function scrapeDevfolio() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto("https://devfolio.co/hackathons", {
    waitUntil: "domcontentloaded",
    timeout: 0,
  });

  console.log("Devfolio loaded");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const titles = await page.evaluate(() => {
    const titleElements = document.querySelectorAll("h3");

    return Array.from(titleElements).map(
      (title) => title.innerText
    );
  });

  console.log(titles);

  await browser.close();
}

scrapeDevfolio();