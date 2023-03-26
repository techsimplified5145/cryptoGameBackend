const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const UserSchema = require("../models/User");
const ethers = require("ethers");
const axios = require("axios");

router.post("/user/save", async (req, res) => {
  console.log(req.body);
  if (req.body.user?.email) {
    let user = await UserSchema.findOne({ email: req.body.user.email });
    console.log("USER ALREADY", user);
    if (!user) {
      const wallet = ethers.Wallet.createRandom();
      const privateKey = wallet.privateKey; // save user private key in our database
      const wallet_address = wallet.address; // save user address in our database
      console.log("Private key:", privateKey);
      console.log("Wallet address:", wallet_address);

      const newUser = new UserSchema({
        email: req.body.user.email,
        picture: req.body.user.picture,
        full_name: req.body.user.full_name,
        wallet_address: wallet_address,
        private_key: privateKey,
        balance: 0,
      });
      newUser.save().then((user) => {
        return res.status(200).json(user);
      });
    } else {
      return res.status(200).json(user);
    }
  } else {
    console.log("USER ALREADY EXISTS");
    return res.status(400).json({ msg: "No email id" });
  }
});

router.post("/add/game/:user", async (req, res) => {
  console.log("ADDING GAME", req.body);
  UserSchema.findByIdAndUpdate(
    req.params.user,
    {
      $push: {
        games: {
          game: req.body.game,
          amount: req.body.amount,
          result: req.body.result,
          win_chances: req.body.win_chances,
        },
      },
      balance: req.body.newBalance,
    },
    { new: true }
  )
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.post("/add/transaction/:user", async (req, res) => {
  console.log("ADDING transaction", req.body);
  UserSchema.findByIdAndUpdate(
    req.params.user,
    {
      $push: {
        transactions: {
          amount: req.body.amount,
          block_number: req.body.block_number,
        },
      },
    },
    { new: true }
  )
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.get("/testing", async (req, res) => {
  return res.status(400).json({ msg: "Server is up and running" });
});
module.exports = router;