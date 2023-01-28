const { request, response } = require("express");

const Category = require("../models/category");

const getCategories = async (req = request, res = response) => {
  const query = { status: true };

  const { limit = 5, from = 0 } = req.query;

  const [totalCount, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("createdBy", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    data: {
      totalCount,
      categories,
    },
  });
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("createdBy", "name");

  res.status(200).json({
    category,
  });
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const { _id } = req.authenticatedUser;

  const category = new Category({ name, createdBy: _id });

  await category.save();

  res.status(201).json({
    msg: "Category created successfully",
    category,
  });
};

const updateCategoryById = async (req = request, res = response) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, {
    name: name,
  }).populate("createdBy", "name");

  res.status(202).json({
    msg: "Category updated",
    category,
  });
};

const deleteCategory = async (req = request, res = response) => {
  const query = { status: false };
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, query).populate(
    "createdBy",
    "name"
  );

  res.status(202).json({
    msg: "Category deleted",
    category,
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategory,
};
