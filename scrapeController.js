const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    const categories = await scrapers.scrapeCategory(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    let result = await scrapers.scraper(browser, selectedCategories[0].link);
    fs.writeFile("chothuephongtro.json", JSON.stringify(result), (error) => {
      if (error) console.log("Ghi data thất bại vào JSON File: " + error);
      console.log("Ghi data thành công vào JSON File");
    });
    let result2 = await scrapers.scraper(browser, selectedCategories[1].link);
    fs.writeFile("nhachothue.json", JSON.stringify(result2), (error) => {
      if (error) console.log("Ghi data thất bại vào JSON File: " + error);
      console.log("Ghi data thành công vào JSON File");
    });
    let result3 = await scrapers.scraper(browser, selectedCategories[2].link);
    fs.writeFile("chothuecanho.json", JSON.stringify(result3), (error) => {
      if (error) console.log("Ghi data thất bại vào JSON File: " + error);
      console.log("Ghi data thành công vào JSON File");
    });
    let result4 = await scrapers.scraper(browser, selectedCategories[3].link);
    fs.writeFile("chothuematbang.json", JSON.stringify(result4), (error) => {
      if (error) console.log("Ghi data thất bại vào JSON File: " + error);
      console.log("Ghi data thành công vào JSON File");
    });
    await browser.close();
  } catch (error) {
    console.log("Lỗi ở scrapeController: " + error);
  }
};

module.exports = scrapeController;
