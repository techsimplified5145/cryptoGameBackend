const mongoose = require("mongoose");

// local uri
//
//
module.exports = mongoose.connect("mongodb+srv://NigerianMB1357:MvWXP5tDoNKWgPNZ@cluster0.z3zbxuv.mongodb.net/?retryWrites=true&w=majority", {
// module.exports = mongoose.connect("mongodb://localhost:27017/profitOutcome", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
