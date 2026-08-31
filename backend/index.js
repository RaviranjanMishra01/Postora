const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require("./routes/authRoutes.route");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello Ravi",
  });
});

app.use('/api', authRoutes);

module.exports = app;