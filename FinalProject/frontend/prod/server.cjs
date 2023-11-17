const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/dist'));

// Redirect '/' to '/home'
app.get('/', (_req, res) => res.redirect('/home'))

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));