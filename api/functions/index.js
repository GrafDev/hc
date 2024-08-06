import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import routerAPI from './src/routes/routes.js'

const app = express();

// Включаем CORS
app.use(cors({ origin: true }));

app.use(express.json());

app.use('/', routerAPI);

app.get('/hello', (req, res) => {
  res.send('Hello I am CSV SPOTIFY API!');
});

// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
export const api = functions.https.onRequest(app);

