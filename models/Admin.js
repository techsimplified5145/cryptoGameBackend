const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  login_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

var Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
