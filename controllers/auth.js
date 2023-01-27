const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const User = require("../models/user");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignin = async (req = request, res = response) => {
  const { id_token } = req.body;
  let msg = "User";

  try {
    const { name, email, picture } = await googleVerify(id_token);

    //  Verify if user exists in db
    let user = await User.findOne({ email });

    const userData = {
      name,
      email,
      password: "123",
      image: picture,
      role: "USER_ROLE",
      googleCreated: true,
    };

    if (!user) {
      // User doesn't exists, create user
      user = new User(userData);
      await user.save();
      msg += "Created";
    } else {
      // User exists, update it
      await User.findOneAndUpdate({ email }, userData);
      msg += "Updated";
    }

    // If user in db
    if (!user.status) {
      return res.status(401).json({
        msg: "Talk to administrator - User disabled",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      msg,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token couldn't be validated",
      error,
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
