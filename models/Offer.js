const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
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
  price: {
    type: String,
  },
  type: {
    type: String,
  },
  details_link: {
    type: String,
  },
  tags: [
    {
      id: {
        type: String,
      },
      text: {
        type: String,
      },
    },
  ],
});

var Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
