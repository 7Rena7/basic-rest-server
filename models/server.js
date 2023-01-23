const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/user";

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();
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
    this.app.use(this.usersPath, require("../routes/users"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
