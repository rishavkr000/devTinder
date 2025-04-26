const express = require('express');

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello!")
})

app.use("/test", (req, res) => {
    res.send("Hello from test!");
})


app.use((req, res) => {
    res.send("Hello World!")
});

app.listen(7777,() => {
    console.log("Server is running on the port 7777");
})