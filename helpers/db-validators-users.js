const Role = require("../models/role");
const User = require("../models/user");

// Role not valid error message
const roleIsValid = async (role = "") => {
  const roles = [];
  let roleCheckMsg = `That role doesn't exists, try with: `;

  const resp = await Role.find();
  resp.forEach((r) => roles.push(r.role));
  roleCheckMsg += `${roles.join(", ")}`;

  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(roleCheckMsg);
  }
};

// Check if user email already exists
const emailExists = async (email = "") => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already in use");
  }
};

// Check if user id exists in db
const userIdExists = async (id = "") => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error("User doesn't exist");
  }
};

// Check if number is positive
const isPositive = (n) => {
  if (n <= 0) {
    throw new Error(`Number must be positive`);
  }
};

module.exports = {
  roleIsValid,
  emailExists,
  userIdExists,
  isPositive,
};
