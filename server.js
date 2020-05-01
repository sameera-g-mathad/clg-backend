const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const Db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
mongoose
  .connect(Db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"));

const port = 4000;

app.listen(port, () => console.log("working"));
