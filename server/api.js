const express = require('express');
const db = require('./db');

const apiRouter = express.Router();

// Helper Functions

const isDefined = data => {
  return typeof data !== "undefined";
}

const allDefined = arr => {
  return arr.every(isDefined);
}

// Minions Middleware

apiRouter.param('minionId', (req, res, next, id) => {
  const minion = db.getFromDatabaseById('minions', String(id));
  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send(`A minion with the ID of '${id}' was not found.`);
  }
});

// Minions Routes

apiRouter.get('/minions', (req, res) => {
  res.send(db.getAllFromDatabase('minions'));
});

apiRouter.post('/minions', (req, res) => {
  const { name, title } = req.body;
  const salary = Number(req.body.salary);
  
  if (allDefined([name, title, salary])) {
    const newMinion = db.addToDatabase('minions', { name, title, salary });
    res.status(201).send(newMinion);
  } else {
    res.status(400).send('Missing data in request body.');
  }
});

apiRouter.get('/minions/:minionId', (req, res) => {
  res.send(req.minion);
});


module.exports = apiRouter;
