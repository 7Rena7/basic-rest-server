const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

const availableCollections = ["categories", "products", "roles", "users"];

const searchUsers = async (filter = "", res = response) => {
  if (ObjectId.isValid(filter)) {
    // Search by id
    const user = await User.findById(filter);
    return res.status(200).json({
      results: user ? [user] : [],
    });
  }

  // Search by name or email
  const regex = new RegExp(filter, "i");
  const query = {
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  };

  const [totalCount, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query),
  ]);

  res.status(200).json({
    totalCount,
    results: users,
  });
};

const searchProducts = async (filter = "", res = response) => {
  if (ObjectId.isValid(filter)) {
    // Search by id
    const product = await Product.findById(filter)
      .populate("createdBy", "name")
      .populate("category", "name");
    return res.status(200).json({
      results: product ? [product] : [],
    });
  }

  // Search by name, price or description
  const regex = new RegExp(filter, "i");
  const query = {
    $or: [{ name: regex }, { description: regex }],
    $and: [{ status: true }],
  };

  const [totalCount, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("createdBy", "name")
      .populate("category", "name"),
  ]);

  res.status(200).json({
    totalCount,
    results: products,
  });
};

const searchCategories = async (filter = "", res = response) => {
  if (ObjectId.isValid(filter)) {
    // Search by id
    const category = await Category.findById(filter).populate(
      "createdBy",
      "name"
    );
    return res.status(200).json({
      results: category ? [category] : [],
    });
  }

  // Search by name
  const regex = new RegExp(filter, "i");
  const query = {
    name: regex,
    status: true,
  };

  const [totalCount, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).populate("createdBy", "name"),
  ]);

  res.status(200).json({
    totalCount,
    results: categories,
  });
};

const search = async (req = request, res = response) => {
  const { collection, filter } = req.params;

  if (!availableCollections.includes(collection)) {
    return res.status(400).json({
      msg: "Collection not available, please check the entered collection name.",
      additionalMsg: `Available collections: ${availableCollections.join(
        ", "
      )}`,
    });
  }

  try {
    switch (collection) {
      case "categories":
        searchCategories(filter, res);
        break;
      case "products":
        searchProducts(filter, res);
        break;
      case "users":
        searchUsers(filter, res);
        break;

      default:
        throw new Error("The specified collection is not available");
    }
  } catch (error) {
    res.status(500).json({
      msg: "An error occured: " + error.message,
    });
  }
};

module.exports = { search };
