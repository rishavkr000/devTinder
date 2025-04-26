const express = require('express');

const app = express();

// This will only handle GET requests to the /user route
app.get("/user", (req, res) => {
    res.send({firstName: "Rishav", lastName: "Kumar"});
})

// This will only handle POST requests to the /user route
app.post("/user", (req, res) => {
    res.send("Hello from user post!");
})

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
})


app.listen(7777,() => {
    console.log("Server is running on the port 7777");
})