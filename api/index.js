import express from 'express';
import cors from 'cors';
import routerAPI from './src/routes/user-routes.js';

const port =  5000;

const data=express();

// Разрешаем запросы с любого домена (для разработки).
// В продакшене укажите конкретные домены.
data.use(cors());

data.use(express.json());
data.use('/',routerAPI);

data.get("/hello", (req, res) => {
  res.send("Hello human!");
});

data.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});