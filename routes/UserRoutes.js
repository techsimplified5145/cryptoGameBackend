const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const UserSchema = require("../models/User");
const ethers = require("ethers");
const WithdrawRequestsSchema = require("../models/WithdrawRequests");

router.post("/user/save", async (req, res) => {
  if (req.body.user?.email) {
    let user = await UserSchema.findOne({ email: req.body.user.email });
    if (!user) {
      const wallet = ethers.Wallet.createRandom();
      const privateKey = wallet.privateKey; // save user private key in our database
      const wallet_address = wallet.address; // save user address in our database

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
    return res.status(400).json({ msg: "No email id" });
  }
});

router.post("/add/game/:user", async (req, res) => {
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
  UserSchema.findByIdAndUpdate(
    req.params.user,
    {
      $push: {
        transactions: {
          amount: req.body.amount,
          block_number: req.body.block_number,
        },
      },
      $inc: { balance: req.body.amount },
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

router.post("/withdraw/request", async (req, res) => {
  const newWithDrawRequest = new WithdrawRequestsSchema({
    user: req.body.user,
    amount: req.body.amount,
    address: req.body.address,
  });
  newWithDrawRequest.save().then(() => {
    UserSchema.findByIdAndUpdate(req.body.user, {
      balance: req.body.newBalance,
    }).then(() => {
      return res.status(200).json({
        msg: "withdraw request sent",
        newBalance: req.body.newBalance,
      });
    });
  });
});

router.post("/update/balance/:user", async (req, res) => {
  console.log("balance updating", req.body);
  UserSchema.findByIdAndUpdate(req.params.user, {
    balance: req.body.newBalance,
  }).then((response) => {
    console.log("DONE", response);
    return res.status(200).json({
      msg: "Balance updated",
      newBalance: req.body.newBalance,
    });
  });
});

router.get("/transaction/history/:user", async (req, res) => {
  WithdrawRequestsSchema.find({
    user: req.params.user,
  })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((e) => {
      return res.status(400).json({ error: e });
    });
});

router.get("/testing", async (req, res) => {
  return res.status(400).json({ msg: "Server is up and running" });
});
module.exports = router;
