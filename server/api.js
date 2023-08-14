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


// Id Middleware

const handleId = (req, res, next) => {
  if (req.id) {
    req.idObj = db.getFromDatabaseById(req.modelName, String(req.id));
    if (!req.idObj) {
      return res.status(404).send(
        `'${req.modelName}' object with the ID of '${req.id}' was not found.`
      );
    }
    switch (req.modelName) {
      case 'ideas':
        req.ideaId = req.id;
        req.idea = req.idObj;
      case 'minions':
        req.minionId = req.id;
        req.minion = req.idObj;
      default:
        break
    }
  }
  next();
};

apiRouter.param('ideaId', (req, res, next, id) => {
  req.id = id;
  req.modelName = 'ideas';
  next();
});

apiRouter.param('minionId', (req, res, next, id) => {
  req.id = id;
  req.modelName = 'minions';
  next();
});


// Ideas Routes

apiRouter.get('/ideas', (req, res) => {
  res.send(db.getAllFromDatabase('ideas'));
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

apiRouter.get('/minions/:minionId', handleId, (req, res) => {
  res.send(req.minion);
});

apiRouter.put('/minions/:minionId', handleId, (req, res) => {
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

apiRouter.delete('/minions/:minionId', handleId, (req, res) => {
  db.deleteFromDatabasebyId('minions', req.minionId);
  res.status(204).send();
});


module.exports = apiRouter;
