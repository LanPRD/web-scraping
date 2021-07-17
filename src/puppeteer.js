const puppeteer = require("puppeteer");
const database = require("./database/createFile.js");

// first letter must be uppercase
const colorFilter = [/*"Branco"*/, "Floral", "Cinza", "Preto"];
const brandFilter = ["dc", "dc-shoes", "element", "hurley", "hang-loose"];
const sizeFilter = ["M"];
const segmentFilter = "?segment=masculino";
const baseUrl = "https://www.kanui.com.br/roupas-masculinas/camisetas/";

let sizeFilterString = "";

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    // const bodyHTMLSize = await page.evaluate(
    //   () => document.body.innerHTML.length
    // );

    // console.log(
    //   "last: ",
    //   lastHTMLSize,
    //   " <> curr: ",
    //   currentHTMLSize,
    //   " body html size: ",
    //   bodyHTMLSize
    // );

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // default is true
    // slowMo: 250, // slow down by 250ms
  });

  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(0);

  if (sizeFilter.length) {
    sizeFilterString = ".tamanho-" + sizeFilter.join("-");
  }

  const url =
    baseUrl +
    brandFilter.join("--") +
    "." +
    "_" +
    colorFilter.join("_") +
    sizeFilterString +
    segmentFilter;

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  await waitTillHTMLRendered(page);

  const lastPage = await page.$eval(
    "li.page:nth-last-child(2) > a",
    (value) => {
      return Number(value.innerHTML.replace(/\n/g, "").replace(/ /g, ""));
    }
  );

  for (let i = 1; i <= lastPage; i++) {
    const { links, images, brands, names, values } = await getAllItems(page);
    let savedPage = 1;

    for (let index = 1; index < links.length; index++) {
      if (links[index - 1].includes("&page=")) {
        const [_, page] = links[index - 1].split("&page=");
        savedPage = page;
      }

      if (i == 1) {
        deleteAllProducts();
      }

      saveData("Kanui", "Camisetas", {
        link: links[index],
        img: images[index],
        page: Number(savedPage),
        brands: brands[index - 1],
        names: names[index - 1],
        values: Number(values[index - 1].replace(/\D/g, "")),
      });
    }

    await page.click(".page.next").catch(async (error) => {
      if (error) await browser.close();
    });
    await page.waitForNavigation();
  }

  await browser.close();
})();

const saveData = (collection, key, value) => {
  try {
    database.saveProduct(collection, key, value);
  } catch (error) {
    console.log(error);
  }
};

const deleteAllProducts = () => {
  try {
    database.deleteProducts();
  } catch (error) {
    console.log(error);
  }
}

const getAllItems = async (page) => {
  return await page.evaluate(() => {
    const links = document.querySelectorAll(".product-box > div > a");
    const images = document.querySelectorAll(".product-box > div > a ");
    const brands = document.querySelectorAll(".product-box > div.product-box-detail > div.product-box-brand");
    const names = document.querySelectorAll(".product-box > div.product-box-detail > p.product-box-title");
    const values = document.querySelectorAll(".product-box > div.product-box-detail > div.product-box-installment > span.product-box-installment-value");
    const arrayLinks = Array.from(links).map((element) => element.href);
    const arrayImages = Array.from(images).map((element) => element.getAttribute("data-model-picture"));
    const arrayBrands = Array.from(brands).map((element) => element.textContent);
    const arrayNames = Array.from(names).map((element) => element.textContent);
    const arrayValues = Array.from(values).map((element) => element.textContent);
    return {
      links: arrayLinks,
      images: arrayImages,
      brands: arrayBrands,
      names: arrayNames,
      values: arrayValues,
    };
  });
};
