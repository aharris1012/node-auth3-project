const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./api/apiRouter');


const server = express();

server.use(helmet());
server.use(express.json());
server.use(morgan('dev'));

server.use('/api', apiRouter);

server.get("/", (req, res) => {
    res.send("It's alive!");
  });

module.exports = server;