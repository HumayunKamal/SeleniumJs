// builder from selenium
import { Builder } from "selenium-webdriver";

// Path and File System for Exploring directories
import path from "path";
import fs from "fs";

// Website Link for scraping
const websiteLink = "https://myip.ms/"; /* Any link */

const checkWebsite = async (weblink) => {
  // Config Driver
  const driver = new Builder().forBrowser("chrome").build();

  //   Maximize the screen
  driver.manage().window().maximize();

  //   Get Website
  await driver.get(weblink);

  // Selenium Code for Scrapping
  // Xpath or CSS Selection

  // Create directory where scraper will save screenshots
  const directory = "screenshots"; /* Folder Name */

  // Create Folder (recursive won't give error if the directory already exists)
  fs.mkdirSync(directory, {
    recursive: true,
  });

  // Get the Current time and use it for fileName
  const currentTime = new Date();
  const formattedTime = currentTime
    .toLocaleString([], { hour12: false }) /* locale-specific formatting */
    .replace(/[/,: ]/g, "_"); /* replace (/,:, ) with (_) */

  // Combine the directory path and the formatted time to create the full path for the screenshot
  const screenshotPath = path.join(directory, `${formattedTime}.png`);

  // Take Screenshot and Save
  await driver.takeScreenshot().then((data) => {
    fs.writeFileSync(screenshotPath, data, "base64");
  });

  // Close the browser (Prevent memory leaks)
  // though while testing you can comment it out or use driver.sleep(time in milisecond)
  await driver.quit();
};

checkWebsite(websiteLink);
