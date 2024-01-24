//required module
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const sticky = require("sticky-session");
const cluster = require("cluster");
const logger = require("morgan");
app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

require("dotenv").config();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(__dirname + "/public"));
app.set("port", process.env.PORT || 5004);
// socket
const http = require("http").createServer(app);

const config = require("./config/config.json");


if (!sticky.listen(http, app.get("port"))) {
  http.once("listening", function () {
    console.log("Server started on port " + app.get("port"));
  });
  if (cluster.isMaster) {
    // Fork workers
    const numWorkers = require("os").cpus().length;
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    // Handle cluster events
    cluster.on("online", (worker) => {
      console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died, forking a new worker...`);
      cluster.fork();
    });
  }
}

//****Database connection mongodb using mongoose */

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost/" + config.MONGODB.DB_NAME, {
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function callback() {
  console.log("Db Connected");
});
require("./routes/mainRoutes")(app);

