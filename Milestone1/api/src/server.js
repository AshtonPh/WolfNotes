const express = require('express');
const router = require('./router');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(router);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));