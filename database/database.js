const mongoose = require("mongoose");

// local uri
// mongodb://localhost:27017/profitOutcome

module.exports = mongoose.connect(
  "mongodb+srv://NigerianMB1357:MvWXP5tDoNKWgPNZ@cluster0.z3zbxuv.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
