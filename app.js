const express = require('express');
const morgan = require('morgan');
const jobRouter = require('./routes/jobRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(`App is running in ${process.env.NODE_ENV}...`);

app.use(express.json());

app.use('/api/v1/jobs', jobRouter);

module.exports = app;
