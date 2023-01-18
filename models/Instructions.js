const mongoose = require("mongoose");

const InstructionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  detailed_description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
  },
  details_link: {
    type: String,
  },
});

var Instructions = mongoose.model("Instructions", InstructionsSchema);
module.exports = Instructions;
