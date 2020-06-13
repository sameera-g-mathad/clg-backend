const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
const ratelimit = require("express-rate-limit");
const mongosanitize = require("express-mongo-sanitize");
const fs = require("fs");
//routers
const staffRouter = require("./Routes/staffRouter");
const cordinatorRouter = require("./Routes/cordinatorRouter");
const studentRouter = require("./Routes/studentRouter");
const path = require("path");
const globalerrhandler = require("./Controllers/errorcontroller");

const app = express();
//app.use(express.static(path.join(__dirname, "/public")));

app.use(helmet());
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));
const limiter = ratelimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Sorry for trouble",
});
app.use(mongosanitize());
app.use("/", limiter);
app.use(xss());
app.use(hpp());

app.use("/cordinator", cordinatorRouter);
app.use("/cordinator-login", cordinatorRouter);
app.use("/staff", staffRouter);
app.use("/staff-login", staffRouter);

app.use("/student-login", studentRouter);
app.use("/student", studentRouter);

app.use(globalerrhandler);
module.exports = app;
