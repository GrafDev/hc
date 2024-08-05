import * as functions from 'firebase-functions';
import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello World 01!');
});

// Удалим прослушивание порта, так как Firebase Functions сами управляют этим
// app.listen(PORT,()=>{
//     console.log(`Server started on port ${PORT}`)
// })

export const api = functions.https.onRequest(app);