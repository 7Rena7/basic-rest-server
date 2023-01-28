const Product = require("../models/product");

// Check if Product name already exists
const productExists = async (name = "") => {
  name = name.toUpperCase();
  const titleName = name[0].toUpperCase() + name.slice(1).toLowerCase();

  const product = await Product.findOne({ name });
  if (product) {
    throw new Error(`Product ${titleName} already exists`);
  }
};

// Check if Product id exists in db
const productIdExists = async (id = "") => {
  const exists = await Product.findById(id);
  if (!exists) {
    throw new Error("Product doesn't exist");
  }
};

module.exports = {
  productExists,
  productIdExists,
};
