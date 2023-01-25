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
      .then(console.log("Base de datos conectada"));
  } catch (error) {
    throw new Error("Error a la hora de inicial la base de datos: ", error);
  }
};

module.exports = {
  dbConnection,
};
