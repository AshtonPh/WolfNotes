const express = require('express');
const cookieparser = require('cookie-parser');
const authenticationRouter = require('./routes/authenticationRouter');
const notesRouter = require('./routes/notesRouter');
const dataRouter = require('./routes/dataRouter');
const tagRouter = require('./routes/tagRouter');
const onlineRouter = require('./routes/onlineRouter');

const app = express();
const PORT = process.env.PORT || 3501;

// Used for dev/debug
// Enable CORS on all requests when "CORS=True" is passed on the command line
if (process.env.CORS && process.env.CORS == "True") {
    const cors = require('cors');
    app.use(cors());
}

app.use(express.json());
app.use(cookieparser());
app.use('/auth', authenticationRouter);
app.use('/notes', notesRouter);
app.use('/data', dataRouter);
app.use('/tags', tagRouter);
app.use('/online', onlineRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));