const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoute = require("./routes/user");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

//==========>Connect DB<===========
connectDB();

//===========>user router<===========
app.use("/api", userRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
