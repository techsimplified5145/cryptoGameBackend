const mongoose = require("mongoose");

const WithdrawRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "pending",
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

var WithdrawRequests = mongoose.model(
  "WithdrawRequests",
  WithdrawRequestSchema
);
module.exports = WithdrawRequests;
