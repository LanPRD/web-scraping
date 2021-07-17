const fs = require("fs");
const path = require("path");
const databaseFile = "database.json";

function saveProduct(collection, key, value) {
  try {
    if (!collection || typeof collection !== "string") {
      throw new Error("Missing or incorrect parameter collection");
    } else if (!key || typeof key !== "string") {
      throw new Error("Missing or incorrect parameter key");
    } else if (!value || typeof value != "object") {
      throw new Error("Missing or incorrect parameter data");
    } else {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, databaseFile), "utf-8"));
      data[collection][key] = [...data[collection][key], { ...value }];
      fs.writeFileSync(path.join(__dirname, databaseFile), JSON.stringify(data, null, 2));
      console.log(`Save ${value}`);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function deleteProducts() {
  try {
    fs.writeFileSync(path.join(__dirname, databaseFile), JSON.stringify({ Kanui: { Camisetas: [] }}, null, 2));
    console.log(`Deteled database values`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { saveProduct, deleteProducts };
