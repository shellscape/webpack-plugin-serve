const puppeteer = require('puppeteer');

const browser = async (t, run) => {
  const instance = await puppeteer.launch();
  const page = await instance.newPage();
  try {
    await run(t, page);
  } finally {
    await page.close();
    await instance.close();
  }
};

module.exports = { browser };
