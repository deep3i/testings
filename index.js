const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser")
const app = express()


app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

app.get("/", (req, res) => {
    res.send("okk done livenoidejs ")
})


app.listen(4003, () => {
    console.log("run at http://localhost:4003");
})