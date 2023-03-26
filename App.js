const express = require("express");
const app = express();
const PORT = process.env.PORT || 7001;

const cors = require("cors");
app.use(cors());

const db = require("./database/database");
db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);

// Routes
const userRoutes = require('./routes/userRoutes')

app.use(express.json());

app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Admin app is running on port ${PORT}`);
});
