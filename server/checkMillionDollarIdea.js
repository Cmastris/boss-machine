const checkMillionDollarIdea = (req, res, next) => {
  const numWeeks = Number(req.body.numWeeks);
  const weeklyRevenue = Number(req.body.weeklyRevenue);
  if (Number.isNaN(numWeeks) || Number.isNaN(weeklyRevenue)) {
    return res.status(400).send(
      'Valid `numWeeks` and/or `weeklyRevenue` values were not provided.'
    );
  } else if (Number(numWeeks) * Number(weeklyRevenue) < 1000000) {
    return res.status(400).send('Idea yields less than $1 million.');
  }
  next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
