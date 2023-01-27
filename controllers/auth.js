const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  const query = { email: email };

  try {
    // Check if email exists
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({
        msg: "There is no user with that email",
      });
    }

    // Check if user is active in db
    if (!user.status) {
      return res.status(400).json({
        msg: "The user is not active",
      });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Password not correct",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Talk to administrator",
    });
  }
};

module.exports = {
  login,
};
