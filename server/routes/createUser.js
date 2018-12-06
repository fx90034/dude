// server/route/createUser.js

const http = require('http');

let model = undefined;

exports.init = function(modelObj) {
  model = modelObj;
}

exports.createUser = function(req, res) {
  model.addUser(req.body.username, req.body.password);
  console.log(res);
  res.status(201);
}
