const { request, response } = require("express");
const { populate } = require("../models/product");

const Product = require("../models/product");

const getProducts = async (req = request, res = response) => {
  const query = { status: true };

  const { limit = 5, from = 0 } = req.query;

  const [totalCount, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("createdBy", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    data: {
      totalCount,
      products,
    },
  });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("createdBy", "name")
    .populate("category", "name");

  res.status(200).json({
    product,
  });
};

const createProduct = async (req = request, res = response) => {
  const { name, category, ...rest } = req.body;
  const { _id } = req.authenticatedUser;

  const product = new Product({
    name: name.toUpperCase(),
    createdBy: _id,
    category: category.toUpperCase(),
    ...rest,
  });

  await product.save();

  res.status(201).json({
    msg: "Product created successfully",
    product,
  });
};

const updateProductById = async (req = request, res = response) => {
  const { ...rest } = req.body;
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, {
    ...rest,
  })
    .populate("createdBy", "name")
    .populate("category", "name");

  res.status(202).json({
    msg: "Product updated",
    product,
  });
};

const deleteProduct = async (req = request, res = response) => {
  const query = { status: false };
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, query)
    .populate("createdBy", "name")
    .populate("category", "name");

  res.status(202).json({
    msg: "Product deleted",
    product,
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProduct,
};
