const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      users: "/api/users",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      upload: "/api/uploads",
    };

    // Connect to DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();
  }

  async connectDB() {
    // Here we could switch between environments to only connect to the necessary DB
    await dbConnection();
  }

  middlewares() {
    // Public directory
    this.app.use(express.static("public"));

    // CORS
    this.app.use(cors());

    // Read and Parse of request body
    this.app.use(express.json());

    // File uploads
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.upload, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Node Cafe App listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
