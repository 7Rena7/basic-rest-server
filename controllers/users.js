const { response, request } = require("express");

const usersGet = (req = request, res = response) => {
  console.log("GET request body: ", req.body);
  console.log("GET request params: ", req.params);
  console.log("GET request query: ", req.query);

  const { q, name, apikey } = req.query;

  if (apikey == undefined || apikey == null || apikey.length <= 0) {
    res.status(401).json({
      msg: "The apikey is not correct",
    });
  }

  res.status(200).json({
    msg: "get API",
    data: {
      query: q,
      userName: name,
    },
  });
};

const usersPost = (req, res = response) => {
  const { nombre, edad } = req.body;

  res.status(201).json({
    msg: "post API",
    nombre: nombre,
    edad: edad,
  });
};

const usersPut = (req, res = response) => {
  const { id } = req.params;

  res.status(200).json({
    msg: "put API",
    userData: {
      id: id,
    },
  });
};

const usersDelete = (req, res = response) => {
  res.status(202).json({
    msg: "delete API",
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
};
