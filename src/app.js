const express = require("express");

const app = express();

// This will handle all requests to the /user route, regardless of the HTTP method
app.use(
  "/user", [
  (req, res, next) => {
    console.log("Middleware 1");
    next();
    // res.send("Hello from user 1");
  },
  (req, res, next) => {
    console.log("Middleware 2");
    // res.send("Hello from user 2");
    next();
  },],
  (req, res, next) => {
    console.log("Middleware 3");
    // res.send("Hello from user 3");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 4");
    // res.send("Hello from user 4");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 5");
    // res.send("Hello from user 5");
    // next();
  }
);

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
