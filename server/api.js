const express = require('express');
const db = require('./db');

const apiRouter = express.Router();

const isDefined = data => {
  return typeof data !== "undefined";
}

apiRouter.get('/minions', (req, res) => {
  res.send(db.getAllFromDatabase('minions'));
});

apiRouter.post('/minions', (req, res) => {
  const { name, title } = req.body;
  const salary = Number(req.body.salary);
  
  if (isDefined(name) && isDefined(title) && isDefined(salary)) {
    const newMinion = db.addToDatabase('minions', { name, title, salary });
    res.status(201).send(newMinion);
  } else {
    res.status(400).send('Missing data in request body.');
  }
});


module.exports = apiRouter;
