const express = require('express');
const db = require('./db');

const apiRouter = express.Router();

apiRouter.get('/minions', (req, res) => {
  res.send(db.getAllFromDatabase('minions'));
});


module.exports = apiRouter;
