const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  email_verified: {
    type: Boolean,
  },
  role: {
    type: String,
    default:"authenticated"
  },
  profit_tracker: [
    {
      date: {
        type: Date,
        default: new Date()
      },
      bookmaker: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
