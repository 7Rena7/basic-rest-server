const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      users: "/api/users",
      categories: "/api/categories",
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

    // Read and Parse of Request Body
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
