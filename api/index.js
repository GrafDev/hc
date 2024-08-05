
import express from 'express';
import routerAPI from './src/routes/user-routes.js'
import { https } from 'firebase-functions';

const port =  5000;

const data=express();


data.use(express.json());
   data.use('/',routerAPI);


data.get("/hello", (req, res) => {
  res.send("Hello human!");
});


data.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export const api = https.onRequest(data);


