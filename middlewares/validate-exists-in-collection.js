const { request, response } = require("express");

const User = require("../models/user");
const Product = require("../models/product");

const validateExistsInCollection = async (
  req = request,
  res = response,
  next
) => {
  const { collection, id } = req.params;

  try {
    switch (collection) {
      case "products":
        const product = await Product.findById(id);
        if (!product) {
          throw new Error("Product doesn't exist");
        }
        req.model = product;
        break;
      case "users":
        const user = await User.findById(id);
        if (!user) {
          throw new Error("User doesn't exist");
        }
        req.model = user;
        break;

      default:
        throw new Error("The specified collection is not available for upload");
    }
  } catch (error) {
    return res.status(400).json({
      msg: "An error occured: " + error.message,
    });
  }

  next();
};

module.exports = {
  validateExistsInCollection,
};
