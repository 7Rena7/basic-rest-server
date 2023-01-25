const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const query = { status: true };

  const { limit = 5, from = 0 } = req.query;

  // const totalCount = await User.countDocuments(query);
  // const users = await User.find(query).skip(Number(from)).limit(Number(limit));

  const [totalCount, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    data: {
      totalCount,
      users,
    },
  });
};

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;

  const user = new User({
    name,
    email,
    password,
    role,
  });

  // Encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save in db
  await user.save();

  res.status(201).json({
    msg: "User created successfully",
    userData: user,
  });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, googleCreated, email, ...rest } = req.body;

  if (password) {
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.status(200).json({
    msg: "put API",
    user,
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.status(202).json({
    msg: "User deleted successfully",
    data: user,
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
};
