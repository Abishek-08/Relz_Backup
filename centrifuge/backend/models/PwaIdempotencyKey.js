const mongoose = require("mongoose");

const pwaIdempotencyKeySchema = mongoose.Schema(
  {
    key: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IdempotencyKey", pwaIdempotencyKeySchema);
