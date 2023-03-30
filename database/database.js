const mongoose = require("mongoose");

// local uri
//
//
module.exports = mongoose.connect("mongodb+srv://MaazKhan:Five1four5@cluster0.n1cyw.mongodb.net/cryptoGames?retryWrites=true&w=majority", {
// module.exports = mongoose.connect("mongodb://localhost:27017/cryptoGames", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
