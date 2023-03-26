const express = require("express");
const app = express();
const PORT = process.env.PORT || 7001;
// const userRoutes = 
const db = require("./database/database.js");

const cors = require("cors");
app.use(cors());

db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);

// Routes

app.use(express.json());

app.use(require('./routes/userRoutes.js'));

app.listen(PORT, () => {
  console.log(`Admin app is running on port ${PORT}`);
});
