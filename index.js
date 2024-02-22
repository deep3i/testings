const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser")
const app = express();
const port = 8080

app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", require("./routes"));

app.get("/", (req, res) => {
    res.send("okk done livenoidejs ")
});


app.listen(port, () => {
    console.log(`run at http://localhost:${port}`);
});