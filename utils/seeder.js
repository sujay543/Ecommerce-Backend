// const Product = require('./models/productModel');
const fs = require('fs');
const productsData = JSON.parse(
  fs.readFileSync("./data/productsData.json", "utf-8")
);

const seedData = async () => {
  try {
    await Product.deleteMany(); // optional
    await Product.insertMany(productsData);
    console.log("Data inserted successfully ✅");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = seedData;