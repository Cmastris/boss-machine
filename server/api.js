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
    req.minionId = id;
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
    if (newMinion) {
      return res.status(201).send(newMinion);
    }
  }
  res.status(400).send('Invalid data in request body.');
});

apiRouter.get('/minions/:minionId', (req, res) => {
  res.send(req.minion);
});

apiRouter.put('/minions/:minionId', (req, res) => {
  const { name, title, weaknesses } = req.body;
  const salary = Number(req.body.salary);

  if (allDefined([name, title, weaknesses, salary])) {
    const updatedData = { id: req.minionId, name, title, weaknesses, salary };
    const updatedMinion = db.updateInstanceInDatabase('minions', updatedData);
    if (updatedMinion) {
      return res.send(updatedMinion);
    }
  }
  res.status(400).send('Invalid data in request body.');
});

apiRouter.delete('/minions/:minionId', (req, res) => {
  db.deleteFromDatabasebyId('minions', req.minionId);
  res.status(204).send();
});


module.exports = apiRouter;
