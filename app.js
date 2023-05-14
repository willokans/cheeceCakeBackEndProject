const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//IMPORT ROUTE
const userRoutes = require("./route/user");

// MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//ROUTE MIDDLEWARE
app.use("/api", userRoutes);

//ERROR MIDDLEWARE
app.use(errorHandler);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

//CONNECT TO OUR DATABASE
mongoose
  .connect(process.env.DATABASE, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
