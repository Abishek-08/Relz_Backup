const PwaIdempotencyKey = require("../models/PwaIdempotencyKey");

exports.createIdempotency = async (data) => {
  return await PwaIdempotencyKey.create(data);
};

exports.getIdempotencyKey = async (key) => {
  return await PwaIdempotencyKey.findOne({ key });
};
