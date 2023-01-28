const Category = require("../models/category");

// Check if category name already exists
const categoryExists = async (name = "") => {
  name = name.toUpperCase();
  const titleName = name[0].toUpperCase() + name.slice(1).toLowerCase();

  const category = await Category.findOne({ name });
  if (category) {
    throw new Error(`Category ${titleName} already exists`);
  }
};

// Check if category id exists in db
const categoryIdExists = async (id = "") => {
  const exists = await Category.findById(id);
  if (!exists) {
    throw new Error("Category doesn't exist");
  }
};

module.exports = {
  categoryExists,
  categoryIdExists,
};
