const express = require('express');
const authenticationRouter = require('./authenticationRouter');
const notesRouter = require('./notesRouter');
const dataRouter = require('./dataRouter');

const app = express();
const PORT = process.env.PORT || 3501;

// Used for dev/debug
// Enable CORS on all requests when "CORS=True" is passed on the command line
if (process.env.CORS && process.env.CORS == "True") {
    const cors = require('cors');
    app.use(cors());
}

app.use(express.json());
app.use('/auth', authenticationRouter);
app.use('/notes', notesRouter);
app.use('/data', dataRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));