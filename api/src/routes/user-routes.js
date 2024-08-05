
import express from 'express'

import FileControllers from '../controllers/file-controllers.js'

const routerAPI=express.Router();


routerAPI.get('/file',(req,res)=>{
  console.log("RouterAPI File")
  const route=FileControllers.readFile(req,res)
  return route
})

export default routerAPI;