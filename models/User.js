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
  wallet_address: {
    type: String,
  },
  private_key: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  games: [
    {
      amount: {
        type: Number,
      },
      result: {
        type: String,
      },
      game: {
        type: String,
      },
      win_chances: {
        type: String,
      },
    },
  ],
  transactions:[{
    amount:{
      type: String
    },
    block_number:{
      type: String
    },
  }]
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
