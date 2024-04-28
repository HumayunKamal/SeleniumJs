// Import builder from selenium
import { Builder } from "selenium-webdriver";

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

  // Close the browser (Prevent memory leaks)
  // though while testing you can comment it out or use driver.sleep(time in milisecond)
  await driver.quit();
};

checkWebsite(websiteLink);
