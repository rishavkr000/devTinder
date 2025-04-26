const express = require("express");

const app = express();

// Route 1 - /ac or /abc
app.get(/^\/ab?c$/, (req, res) => {
  res.send("Matched /ac or /abc");
});

// Route 2 - /abc, /abbc, /abbbc, etc.
app.get(/^\/ab+c$/, (req, res) => {
  res.send("Matched /abc, /abbc, /abbbc etc.");
});

// Route 3 - /ad or /abcd
app.get(/^\/a(bc)?d$/, (req, res) => {
  res.send("Matched /ad or /abcd");
});

// Route 4 - Any route containing 'a'
app.get(/a/, (req, res) => {
  res.send("Matched route containing 'a'");
});

// Route 5 - Match /xyz123 exactly
app.get(/^\/xyz123$/, (req, res) => {
  res.send("Matched /xyz123 exactly");
});

// Route 6 - Match /user123, /user456 etc.
app.get(/^\/user\d+$/, (req, res) => {
  res.send("Matched /user followed by numbers");
});

// Route 7 - Match /product-abc or /product-xyz
app.get(/^\/product\-[a-z]+$/, (req, res) => {
  res.send("Matched /product- followed by small letters");
});

// Route 8 - Match /file.txt, /file.csv, /file.json
app.get(/^\/file\.(txt|csv|json)$/, (req, res) => {
  res.send("Matched /file.txt, /file.csv, /file.json");
});

// Route 9 - Match /api/v1 or /api/v2
app.get(/^\/api\/v[12]$/, (req, res) => {
  res.send("Matched /api/v1 or /api/v2");
});

// Route 10 - Match any path ending with 'end'
app.get(/end$/, (req, res) => {
  res.send("Matched path ending with 'end'");
});

// This will only handle GET requests to the /user route
app.get("/user", (req, res) => {
  res.send({ firstName: "Rishav", lastName: "Kumar" });
});

// This will only handle POST requests to the /user route
app.post("/user", (req, res) => {
  res.send("Hello from user post!");
});

//This will only handle PUT requests to the /user route
app.put("/user", (req, res) => {
  res.send("Hello from user put!");
});

// This will only handle DELETE requests to the /user route
app.delete("/user", (req, res) => {
  res.send("Hello from user delete!");
});

// This will handle all requests to the /user route, regardless of the HTTP method
app.use("/user", (req, res) => {
  res.send("Hello from test!");
});

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
