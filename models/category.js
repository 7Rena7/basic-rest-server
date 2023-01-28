const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, _id, status, ...categoryData } = this.toObject();
  categoryData.uid = _id;
  return categoryData;
};

module.exports = model("Category", CategorySchema);
