const express = require("express");

const app = express();

const { isAdmin } = require("./middlewares/auth");

// app.use("/admin", isAdmin)

app.get("/admin/getAllData", isAdmin, (req, res) => {
  res.send("Accessed all data");
});

app.delete("/admin/deleteAllData", (req, res) => {
  res.send("Deleted all data");
});

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
