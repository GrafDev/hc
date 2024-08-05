import * as functions from 'firebase-functions';
import express from 'express';
import routerAPI from './src/routes/routes.js'
import cors from 'cors';

const app = express();

// Включаем CORS
app.use(cors({ origin: true }));

app.use(express.json());

app.use('/', routerAPI);

app.get('/hello', (req, res) => {
  res.send('Hello I am CSV SPOTIFY API!');
});

export const api = functions.https.onRequest(app);

