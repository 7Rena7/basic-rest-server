const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadFileHelper = (
  { file } = {},
  extensions = ["txt", "pdf", "jpg", "png", "jpeg"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const splittedFileName = file.name.split(".");
    const fileExtension = splittedFileName[splittedFileName.length - 1];

    //   Validate file extension

    if (!extensions.includes(fileExtension)) {
      reject(
        `File type not allowed, the file types allowed are: ${extensions.join(
          ", "
        )}`
      );
    }

    //   Generate unique id
    const tempName = uuidv4() + "." + fileExtension;

    //   Store file in uploads folder
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        console.log(err);
        reject(err.message);
      }

      resolve([tempName, uploadPath]);
    });
  });
};

module.exports = { uploadFileHelper };
