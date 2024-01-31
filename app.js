const express = require("express");
const parser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const chatRouter = require("./routes/chatRoutes");

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use("/", chatRouter);

module.exports = app;
