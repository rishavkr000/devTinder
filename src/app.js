const express = require("express");

const app = express();

// const { isAdmin } = require("./middlewares/auth");

// app.use("/admin", isAdmin)

// app.get("/getAllData", (req, res) => {
//   throw new Error("Error occurred while fetching data");
//   res.send("Accessed all data");
// });

// app.use("/", (err, req, res, next) => {
//   res.status(500).send("Something went wrong: " + err.message);
//   // console.error(err.stack);
// });

app.get("/getAllData", (req, res) => {
  try{
    // Simulating an error
    throw new Error("Error occurred while fetching data");
    res.send("Accessed all data");
  } catch(err) {
    res.status(500).send("Something went wrong from catch: " + err.message);
  }
})

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
