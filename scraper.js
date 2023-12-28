const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log("==> Mở tab mới thành công");
      await page.goto(url);
      console.log("==> Đi tới đường dẫn: " + url);
      await page.waitForSelector("#webpage");
      console.log("==> Load dữ liêu web thành công");

      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (els) => {
          dataCategory = els.map((el) => {
            return {
              category: el.querySelector("a").innerText,
              link: el.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );

      await page.close();
      console.log("==> Tab đóng----");
      resolve(dataCategory);
    } catch (error) {
      console.log("Lỗi ở ScrapeCategory: " + error);
      reject(error);
    }
  });
const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log("==> Mở tab mới thành công");
      await newPage.goto(url);
      console.log("==> Đi tới đường dẫn: " + url);
      await newPage.waitForSelector("#main");
      console.log("==> Load dữ liêu web thành công");
      const scrapeData = {};
      const headerData = await newPage.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          description: el.querySelector("p").innerText,
        };
      });
      scrapeData.header = headerData;

      const detailLinks = await newPage.$$eval(
        "#left-col > section.section-post-listing > ul.post-listing > li.post-item",
        (els) => {
          detailLinks = els.map((el) => {
            return el.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        }
      );

      const scraperDetail = (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            console.log("==> Truy cập: " + link);
            await pageDetail.waitForSelector("#main");

            const detailData = {};

            const images = await pageDetail.$$eval(
              "#left-col > article.the-post > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
              (els) => {
                const validEls = els.filter((el) => el !== null);

                const images = validEls.map((el) => {
                  const imgElement = el.querySelector("img");
                  return imgElement ? imgElement.src : null;
                });
                return images;
              }
            );

            detailData.images = images;

            const header = await pageDetail.$eval(
              "header.page-header",
              (el) => {
                return {
                  title: el.querySelector("h1 > a").innerText,
                  start: el
                    .querySelector("h1 > span")
                    ?.className?.replace(/^\D+/g, ""),
                  class: {
                    content: el.querySelector("p").innerText,
                    classType: el.querySelector("p > a > strong").innerText,
                  },
                  address: el.querySelector("address").innerText,
                  attributes: {
                    price: el.querySelector(
                      "div.post-attributes > .price > span"
                    ).innerText,
                    acreage: el.querySelector(
                      "div.post-attributes > .acreage > span"
                    ).innerText,
                    published: el.querySelector(
                      "div.post-attributes > .published > span"
                    ).innerText,
                    hashtag: el.querySelector(
                      "div.post-attributes > .hashtag > span"
                    ).innerText,
                  },
                };
              }
            );

            detailData.header = header;

            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (el) => el.querySelector("div.section-header > h2").innerText
            );
            const mainContentContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content> div.section-content > p",
              (els) => els.map((el) => el.innerText)
            );

            detailData.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };

            const overViewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (el) => el.querySelector("div.section-header > h3").innerText
            );
            const overViewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview> div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );

            detailData.overView = {
              header: overViewHeader,
              content: overViewContent,
            };

            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-contact",
              (el) => el.querySelector("div.section-header > h3").innerText
            );
            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact> div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );

            detailData.contact = {
              header: contactHeader,
              content: contactContent,
            };

            await pageDetail.close();
            console.log("==> Đã đóng tab: " + link);
            resolve(detailData);
          } catch (error) {
            console.log("Lấy data Detail lỗi: " + error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scraperDetail(link);
        details.push(detail);
      }

      scrapeData.body = details;

      await newPage.close();
      console.log("==> Tab đóng----");
      resolve(scrapeData);
    } catch (error) {
      console.log("Lỗi ở scraper: " + error);
      reject(error);
    }
  });
module.exports = { scrapeCategory, scraper };
