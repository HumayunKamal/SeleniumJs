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

// For importing values from .env
import dotenv from "dotenv";
dotenv.config();

// ProxyChain is use to create proxy server
import proxyChain from "proxy-chain";

// nodemailder for sending email
import nodemailer from "nodemailer";

// consts from .env
const websiteLink = process.env.WEBSITE_LINK; /* Any website link */
const rerunWait = process.env.RERUN_TIME;
const proxyUsername = process.env.DOMAIN_USERNAME;
const proxyPassword = process.env.DOMAIN_PASSWORD;
const proxyDomain = process.env.PROXYDOMAIN;
const proxyPort = process.env.PROXYPORT;

// Google App Password consts from .env

const gmailAppUsername = process.env.GMAIL_APP_USERNAME;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const gmailSender = process.env.GMAIL_SENDER;
const gmailReceiver = process.env.GMAIL_SENDER;

// Nodemailer config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: gmailAppUsername,
    pass: gmailAppPassword,
  },
});

const checkWebsite = async (parentDir) => {
  // Config Driver
  // Ip Authentication Config
  // const driver = new Builder()
  //   .forBrowser("chrome")
  //   .setProxy(
  //     proxy.manual({
  //       http: `${proxyDomain}:${proxyPort}` /* proxyProviderDomainName:domainPort */,
  //       https: `${proxyDomain}:${proxyPort}` /* proxyProviderDomainName:domainPort */,
  //     })
  //   )
  //   .build();

  // Username and Password Config
  // const driver = new Builder()
  //   .forBrowser("chrome")
  //   .setProxy(
  //     proxy.manual({
  //       http: `${proxyUsername}:${proxyPassword}@${proxyDomain}:${proxyPort}` /* username:password@ProxyDomainName:DomainPort */,
  //       https: `${proxyUsername}:${proxyPassword}@${proxyDomain}:${proxyPort}` /*username:password ProxyDomainName:DomainPort */,
  //     })
  //   )
  //   .build();

  // Username and Password Auth with Library
  // Third party library for proxy authentication
  // const proxyAgent = await proxyChain.anonymizeProxy(
  //   `http://${proxyUsername}:${proxyPassword}@${proxyDomain}:${proxyPort}`
  // );

  // // Config Driver
  // const driver = new Builder()
  //   .forBrowser("chrome")
  //   .setProxy(
  //     proxy.manual({
  //       http: proxyAgent,
  //       https: proxyAgent,
  //     })
  //   )
  //   .build();

  // Chrome Config
  const chromeOptions = new chrome.Options();
  // chromeOptions.addArguments(
  //   "--headless"
  // ); /* Run scrapper headlessly like won't open chrome window but will run in background */

  // Config Driver (without any proxy)
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  //   Maximize the screen
  driver.manage().window().maximize();

  //   Get Website
  await driver.get(websiteLink);

  // Selenium Code for Scrapping
  // Xpath or CSS Selection

  // Get the Current time and use it for fileName
  const currentTime = new Date();
  const formattedTime = currentTime
    .toLocaleString([], { hour12: false }) /* locale-specific formatting */
    .replace(/[/,: ]/g, "_"); /* replace (/,:, ) with (_) */

  // Combine the directory path and the formatted time to create the full path for the screenshot
  const screenshotPath = path.join(parentDir, `${formattedTime}.png`);

  // Take Screenshot and Save
  await driver.takeScreenshot().then((data) => {
    fs.writeFileSync(screenshotPath, data, "base64");
  });
  console.log("ScreenShot Taken and saved");

  const info = await transporter.sendMail({
    from: `"UserName 👻" ${gmailSender}`, // Sender name and Sender address
    to: `${gmailReceiver}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments: {
      filename: `${formattedTime}.png`,
      path: screenshotPath,
    },
  });

  console.log("Message sent: %s", info.messageId);

  // Close the browser (Prevent memory leaks)
  // though while testing you can comment it out or use driver.sleep(time in milisecond)
  await driver.quit();
};

// Create directory where scraper will save screenshots
const parentDirectory = "screenshots"; /* Folder Name */

// Create Folder (recursive won't give error if the directory already exists)
fs.mkdirSync(parentDirectory, { recursive: true });

// Function to run the website check and take screenshots
async function runWebsiteCheck() {
  try {
    await checkWebsite(parentDirectory);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
}

// Run the website and check immediately
runWebsiteCheck();

// Set interval to run the website check every (rerunWait in seconds) minutes
setInterval(runWebsiteCheck, rerunWait * 1000); // rerunWait is in seconds, so multiply by 1000 to convert to milliseconds
