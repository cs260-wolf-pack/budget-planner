<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/budget-tracker-2", {
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = require("./users.js");
app.use("/api/users", users.routes);

const budget = require("./budget.js");
app.use("/api/budget", budget.routes);

app.listen(3005, () => console.log("Server listening on port 3005!"));
=======
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/budget-tracker-2", {
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = require("./users.js");
app.use("/api/users", users.routes);

const budget = require("./budget.js");
app.use("/api/budget", budget.routes);

const auth = require("./auth.js");
app.use("/api/auth", auth.routes);

app.listen(3005, () => console.log("Server listening on port 3005!"));
>>>>>>> ef3b635dc260101132ba3774dfa7179af9608fb5
