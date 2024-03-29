const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser")
const app = express();
const port = 8080

app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend URL
}));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", require("./routes"));
app.use("/api", require("./solana.js"));

app.get("/", (req, res) => {
    res.send("okk done  ")
});

app.listen(port, () => {
    console.log(`run at http://localhost:${port}`);
});
