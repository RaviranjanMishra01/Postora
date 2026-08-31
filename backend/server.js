const dotenv = require("dotenv");
const connectDB = require("./DB/connectDB");
const app = require("./index");

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});