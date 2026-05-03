const express = require("express");
const app = express();

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("🚨 SOS Backend Working");
});

// SOS API
app.post("/sos", (req, res) => {
    console.log("SOS RECEIVED:", req.body);

    res.json({
        message: "SOS received",
        data: req.body
    });
});

// START SERVER
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});