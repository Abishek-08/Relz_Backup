
const Counter = require('../models/Counter');

const getNextSequence = async (sequenceName) => {
  const counter = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

module.exports = getNextSequence;
