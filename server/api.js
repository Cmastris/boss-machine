const express = require('express');
const db = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

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


// General Routes

apiRouter.get(['/minions/:minionId', '/ideas/:ideaId'], handleId, (req, res) => {
  res.send(req.idObj);
});

apiRouter.delete(['/minions/:minionId', '/ideas/:ideaId'], handleId, (req, res) => {
  db.deleteFromDatabasebyId(req.modelName, req.id);
  res.status(204).send();
});


// Ideas Routes

apiRouter.get('/ideas', (req, res) => {
  res.send(db.getAllFromDatabase('ideas'));
});

apiRouter.post('/ideas', checkMillionDollarIdea, (req, res) => {
  const { name, description, numWeeks, weeklyRevenue } = req.body;
  if (allDefined([name, description, numWeeks, weeklyRevenue])) {
    const newIdea = db.addToDatabase('ideas', {
      name,
      description,
      numWeeks: Number(numWeeks),
      weeklyRevenue: Number(weeklyRevenue)
    });
    if (newIdea) {
      return res.status(201).send(newIdea);
    }
  }
  res.status(400).send('Invalid data in request body.');
});

apiRouter.put('/ideas/:ideaId', handleId, checkMillionDollarIdea, (req, res) => {
  const { name, description, numWeeks, weeklyRevenue } = req.body;
  if (allDefined([name, description, numWeeks, weeklyRevenue])) {
    const updatedIdea = db.updateInstanceInDatabase('ideas', {
      id: req.ideaId,
      name,
      description,
      numWeeks: Number(numWeeks),
      weeklyRevenue: Number(weeklyRevenue)
    });
    if (updatedIdea) {
      return res.send(updatedIdea);
    }
  }
  res.status(400).send('Invalid data in request body.');
});


// Meetings Routes

apiRouter.get('/meetings', (req, res) => {
  res.send(db.getAllFromDatabase('meetings'));
});


// Minions Routes

apiRouter.get('/minions', (req, res) => {
  res.send(db.getAllFromDatabase('minions'));
});

apiRouter.post('/minions', (req, res) => {
  const { name, title, salary } = req.body;
  if (allDefined([name, title, salary])) {
    const newMinion = db.addToDatabase('minions', { name, title, salary: Number(salary) });
    if (newMinion) {
      return res.status(201).send(newMinion);
    }
  }
  res.status(400).send('Invalid data in request body.');
});

apiRouter.put('/minions/:minionId', handleId, (req, res) => {
  const { name, title, weaknesses, salary } = req.body;
  if (allDefined([name, title, weaknesses, salary])) {
    const updatedData = { id: req.minionId, name, title, weaknesses, salary: Number(salary) };
    const updatedMinion = db.updateInstanceInDatabase('minions', updatedData);
    if (updatedMinion) {
      return res.send(updatedMinion);
    }
  }
  res.status(400).send('Invalid data in request body.');
});


module.exports = apiRouter;
