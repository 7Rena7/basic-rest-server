const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGODB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: true,
      })
      .then(console.log("DB Connected"));
  } catch (error) {
    throw new Error("Errors occured when trying to connect to DB: ", error);
  }
};

module.exports = {
  dbConnection,
};
