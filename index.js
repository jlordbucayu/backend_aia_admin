const express = require("express");
var bodyParser = require("body-parser");
require("./db/mongoose");
const fs = require("fs");

const cors = require("cors");
const path = require("path");

const port = 5001 || 5002;
const app = express();

//routers
const userRouter = require("./routers/users");
const businessRouter = require("./routers/business");
const articleRouter = require("./routers/articles");

//admin users
const adminUserRouter = require("./routers/aia/users");
const accessLevelRouter = require("./routers/aia/access_levels");

app.use(cors());
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//routers op
app.use(userRouter, businessRouter, articleRouter, adminUserRouter,accessLevelRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
