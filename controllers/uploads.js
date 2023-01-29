const { request, response } = require("express");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFileHelper } = require("../helpers");

const uploadFile = async (req = request, res = response) => {
  //   Custom allowed extensions - strings - 2nd parameter in uploadFileHelper
  //   const extensions = ["txt"];

  //   Custom path in uploads folder - string - 3rd parameter in uploadFileHelper
  //   const path = "texts";

  try {
    const [fileName] = await uploadFileHelper(req.files, undefined, undefined);
    res.status(200).json({ msg: `File uploaded: ${fileName}` });
  } catch (err) {
    res.status(400).json({ msg: `An error occured: ${err}` });
  }
};

// Example for personal use ONLY
const uploadFileById = async (req = request, res = response) => {
  const { collection } = req.params;
  //   Model brought from validateExistsInCollection
  const { model } = req;

  const extensions = ["png", "jpg", "jpeg"];

  try {
    const [fileName, uploadPath] = await uploadFileHelper(
      req.files,
      extensions,
      collection
    );

    // Delete previouse images if they exist in file system
    if (model.image && fs.existsSync(model.image)) {
      fs.unlinkSync(model.image);
    }

    model.imageName = fileName;
    model.image = uploadPath;

    await model.save();

    res.status(200).json({ model });
  } catch (err) {
    res.status(400).json({ msg: `An error occured: ${err}` });
  }
};

const uploadFileByIdCloudinary = async (req = request, res = response) => {
  //   Model brought from validateExistsInCollection
  const { model } = req;

  try {
    const { tempFilePath } = req.files.file;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      tempFilePath
    );

    // Delete previouse images if they exist in cloudinary
    if (model.image) {
      const nameArr = model.image.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");
      cloudinary.uploader.destroy(public_id);
    }

    model.image = secure_url;

    await model.save();

    res.status(200).json({ model });
  } catch (err) {
    res.status(400).json({ msg: `An error occured: ${err}` });
  }
};

const getImageById = (req = request, res = response) => {
  const { model } = req;

  if (model.image && fs.existsSync(model.image)) {
    return res.sendFile(model.image);
  }

  // Entity doesn't have image assigned, send placeholder
  const pathPlaceholder = path.join(
    __dirname,
    "../assets/placeholderAvatar.png"
  );
  res.sendFile(pathPlaceholder);
};

module.exports = {
  uploadFile,
  uploadFileById,
  uploadFileByIdCloudinary,
  getImageById,
};
