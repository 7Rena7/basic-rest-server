const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  imageName: { type: String },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: [true, "The role is required"],
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  googleCreated: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...userData } = this.toObject();
  userData.uid = _id;
  return userData;
};

module.exports = model("Users", UserSchema);
