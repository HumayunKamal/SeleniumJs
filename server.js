// Builder from selenium
// Capabilities for adding arguments (configuring proxies)
import { Builder, Capabilities } from "selenium-webdriver";
// proxy for using proxy methods
import proxy from "selenium-webdriver/proxy.js";
// Chrome for Chrome configuration
import chrome from "selenium-webdriver/chrome.js";

// Path and File System for Exploring directories
import path from "path";
import fs from "fs";

// ProxyChain is use to create proxy server
import proxyChain from "proxy-chain";

// Website Link for scraping
const websiteLink = "https://myip.ms/"; /* Any link */

const checkWebsite = async (weblink) => {
  // Config Driver
  // Ip Authentication Config
  // const driver = new Builder()
  //   .forBrowser("chrome")
  //   .setProxy(
  //     proxy.manual({
  //       http: "http://domainName:domainPort" /* proxyProviderDomainName:domainPort */,
  //       https:
  //         "https://domainName:domainPort" /* proxyProviderDomainName:domainPort */,
  //     })
  //   )
  //   .build();

  // Username and Password Config
  // const driver = new Builder()
  //   .forBrowser("chrome")
  //   .setProxy(
  //     proxy.manual({
  //       http: "http://username:password@DomainName:Port" /* username:password@ProxyDomainName:DomainPort */,
  //       https:
  //         "https://username:password@DomainName:Port" /*username:password ProxyDomainName:DomainPort */,
  //     })
  //   )
  //   .build();

  // Username and Password Auth with Library
  // Third party library for proxy authentication
  // const proxyAgent = await proxyChain.anonymizeProxy(
  //   "http://username:password@DomainName:DomainPort"
  // );

  // Config Driver
  //  const driver = new Builder()
  //  .forBrowser("chrome")
  //  .setProxy(
  //    proxy.manual({
  //      http: proxyAgent,
  //      https: proxyAgent,
  //    })
  //  )
  //  .build();

  // Config Driver (without any proxy)
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
  // await driver.quit();
};

checkWebsite(websiteLink);
