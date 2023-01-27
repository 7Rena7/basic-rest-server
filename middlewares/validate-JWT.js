const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request",
    });
  }

  try {
    const query = { role: "ADMIN_ROLE" };
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const authenticatedUser = await User.findById(uid);

    if (!authenticatedUser) {
      return res.status(401).json({
        msg: "User trying to do the action doesn't exist",
      });
    }

    if (!authenticatedUser.status) {
      return res.status(401).json({
        msg: "User trying to do the action is not longer active",
      });
    }

    if (!authenticatedUser) {
      throw new Error(
        "The user trying to do the action doesn't have the permissions to do it"
      );
    }

    req.authenticatedUser = authenticatedUser;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token not valid",
      additionalMsg: error.message,
    });
  }
};

module.exports = {
  validateJWT,
};
