const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin"); // assuming that you have a model for the Admin schema in MongoDB
const UserSchema = require("../models/User");
const WithdrawRequests = require("../models/WithdrawRequests");

router.post("/admin/login", async (req, res) => {
  const { login_id, password } = req.body.data;
  console.log(req.body.data);
  try {
    // Check if the admin with the login_id exists in the database
    const admin = await Admin.findOne({ login_id });

    if (!admin) {
      // If the admin does not exist, respond with a 404 error
      return res.status(404).send("Login ID not found");
    }

    // If the admin exists, verify the password

    if (password !== admin.password) {
      // If the password is incorrect, respond with a 401 Unauthorized error
      return res.status(401).send("Incorrect password");
    }

    // If both login_id and password are correct, respond with a 200 OK success message
    res.status(200).send({ admin, msg: "Login successful" });
  } catch (error) {
    // If there is an error, respond with a 500 Internal Server Error
    res.status(500).send("Internal Server Error");
  }
});

router.post("/admin/user/block/:id", async (req, res) => {
  console.log(req.body);
  try {
    const user = await UserSchema.findByIdAndUpdate(req.params.id, {
      blocked: req.body.blocked,
    });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/admin/users", async (req, res) => {
  try {
    const users = await UserSchema.find();
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ msg: "No user found" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/admin/withdraw/requests", async (req, res) => {
  try {
    const requests = await WithdrawRequests.find();
    if (requests) {
      return res.status(200).json(requests);
    } else {
      return res.status(404).json({ msg: "No user found" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/admin/update/withdraw/request/:id", async (req, res) => {
  console.log(req.body);
  try {
    const requests = await WithdrawRequests.findByIdAndUpdate(req.params.id, {
      status: req.body.newStatus,
    });
    if (requests) {
      return res.status(200).json(requests);
    } else {
      return res.status(404).json({ msg: "No user found" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/admin/create", async (req, res) => {
  const { login_id, password, name } = req.body;

  try {
    // Check if an admin with the same login_id already exists
    const existingAdmin = await Admin.findOne({ login_id });

    if (existingAdmin) {
      // If an admin with the same login_id exists, respond with a 409 Conflict error
      return res.status(409).send("Admin with login ID already exists");
    }

    // If an admin with the same login_id does not exist, create a new admin document
    const newAdmin = new Admin({
      login_id,
      password,
      name,
    });

    // Save the new admin document to the database
    await newAdmin.save();

    // Respond with a 201 Created status code and the newly created admin object
    res.status(201).json(newAdmin);
  } catch (error) {
    // If there is an error, respond with a 500 Internal Server Error
    res.status(500).send("Internal Server Error");
  }
});

router.get("/total/payments", async (req, res) => {
  try {
    const payments = await WithdrawRequests.find();
    let rejectedTotal = 0;
    let releasedTotal = 0;
    let pendingTotal = 0;
    payments.forEach((payment) => {
      switch (payment.status) {
        case "rejected":
          rejectedTotal += payment.amount;
          break;
        case "released":
          releasedTotal += payment.amount;
          break;
        case "pending":
          pendingTotal += payment.amount;
          break;
      }
    });
    const totals = {
      rejected: rejectedTotal,
      released: releasedTotal,
      pending: pendingTotal,
    };
    res.status(200).json(totals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
