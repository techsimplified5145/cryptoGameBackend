const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;

const cors = require("cors");
app.use(cors());

const db = require("./database/database");
db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);

// Routes
const adminRoutes = require('./routes/adminRoutes')

app.use(express.json());

app.use(adminRoutes);

app.listen(PORT, () => {
  console.log(`Admin app is running on port ${PORT}`);
});
