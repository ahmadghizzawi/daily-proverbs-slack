require('./config/config.js');

const express = require('express');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const raven = require('raven');
const winston = require('winston');
const cors = require('cors');

const { scheduleCrons } = require('./app/controllers/cron.js')
const landing = require('./app/routes');
const slack = require('./app/routes/slack');


const app = express();

// connect to Mongo when the app initializes
mongoose.connect(process.env.DB_PATH, { useMongoClient: true });

// Set CORS(Cross-origin resource sharing) options
const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// Set logging level
winston.level = process.env.LOG_LEVEL;

// Configure Raven (Sentry) to report errors.
raven.config(process.env.SENTRY_DSN).install();

app.use(raven.requestHandler());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(validator({
  customValidators: {
  },
  customSanitizers: {
  },
}));

app.use(cors(corsOptions));
app.use('/', landing);
app.use('/slack', slack);

// The error handler must be before any other error middleware
app.use(raven.errorHandler());

process.on('uncaughtException', (err) => {
  winston.log('crit', err.stack);
});

app.listen(process.env.LISTENER_PORT, () => {
  winston.log('info', `App is listening on port ${process.env.LISTENER_PORT}`);
  scheduleCrons();
});
