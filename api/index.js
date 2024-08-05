import express from 'express';
import routerAPI from './src/routes/routes.js'

const PORT = 3000;
const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
  res.send('Hello World 01!');
});

app.use('/', routerAPI);

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})

// export const api = functions.https.onRequest(app);