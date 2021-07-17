const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const databaseFile = path.join(__dirname, "database", "database.json");

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  let data = JSON.parse(fs.readFileSync(databaseFile, "utf-8"));

  data["Kanui"]["Camisetas"].sort((a, b) => a.values - b.values).forEach(product => {
    let [int, cents] = (product.values / 100).toString().split(".");
    if (cents && cents.length < 2) cents = `${cents}0`;
    product.values = `${int},${cents || "00"}`;
  });

  res.render("index" , { data: data["Kanui"]["Camisetas"].filter(product => !product.names.toLowerCase().includes("regata") && !product.names.toLowerCase().includes("manga longa")) });
});

app.listen(8080, () => console.log("Running on port 8080"));