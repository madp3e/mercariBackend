const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  credential: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json("Hello 4");
});

let getUrl;
app.post("/test", async (req, res) => {
  getUrl = { link: req.body.mercariLink };
  console.log(getUrl);
  res.json(req.body.mercariLink);
});

app.get("/test2", async (req, res) => {
  try {
    const receivedUrl = "https://www.mercari.com/jp/items/m91591104447/";
    console.log(receivedUrl);
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(receivedUrl);

    const datas = await page.evaluate(() => {
      let isDeleted =
        document.getElementsByClassName("deleted-item-name").length > 0;

      let itemName;
      let itemPrice;
      let itemImage;

      if (isDeleted) {
        itemName = "Item Deleted";
        itemPrice = "Item Deleted";
        itemImage =
          "https://japan.norton.com/blog/wp-content/uploads/2017/01/delete-history-00-730x382.png";
      } else {
        itemName = document.querySelector('h1[class="item-name"]').innerText;
        itemPrice = document.querySelector('span[class="item-price bold"]')
          .innerText;
        itemImage = document.querySelector('img[class="owl-lazy"]').src;
      }
      return {
        itemImage,
        itemName,
        itemPrice,
      };
    });
    console.log(datas);
    res.json(datas);
  } catch {
    (error) => {
      console.log(error.message);
    };
  }
});

// app.post("/link", async (req, res) => {
//   const receivedUrl = req.body.mercariLink;

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(receivedUrl);

//   const datas = await page.evaluate(() => {
//     let isDeleted =
//       document.getElementsByClassName("deleted-item-name").length > 0;

//     let itemName;
//     let itemPrice;
//     let itemImage;

//     if (isDeleted) {
//       itemName = "Item Deleted";
//       itemPrice = "Item Deleted";
//       itemImage =
//         "https://japan.norton.com/blog/wp-content/uploads/2017/01/delete-history-00-730x382.png";
//     } else {
//       itemName = document.querySelector('h1[class="item-name"]').innerText;
//       itemPrice = document.querySelector('span[class="item-price bold"]')
//         .innerText;
//       itemImage = document.querySelector('img[class="owl-lazy"]').src;
//     }
//     return {
//       itemImage,
//       itemName,
//       itemPrice,
//     };
//   });
//   console.log(receivedUrl);
//   res.json(receivedUrl);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

// https://www.mercari.com/jp/items/m14777284171/
