import FileControllers from '../controllers/file-controllers.js'
import MessageControllers from '../controllers/message-controller.js'
import JsonControllers from '../controllers/json-controller.js'

import express from 'express'
const routerAPI = express.Router();

routerAPI.get('/file', (req, res) => {
  console.log("RouterAPI File");
  const route = FileControllers.readFile(req, res);
  return route;
});

routerAPI.get('/short-file', (req, res) => {
  console.log("RouterAPI ShortFile");
  const route = FileControllers.readShortFile(req, res);

  return route;
});

routerAPI.get('/json', (req, res) => {
  console.log("RouterAPI Json");
  const route = JsonControllers.readJson(req, res);
  return route;
});

routerAPI.get('/isok', (req, res) => {
  const route = MessageControllers.getServiceOk(req, res);
  return route;
});

export default routerAPI;