const express = require('express');
const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes

module.exports = app;