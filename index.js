const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser")
const app = express()
const mysql = require("mysql");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"dummy"
});



app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

app.get("/", (req, res) => {
    connection.connect((err) => {
       if (err) {
        throw err
       }
      return res.send("database connected successfully")
    })
    // res.send("okk done livenoidejs ")
})


app.listen(4003, () => {
    console.log("run at http://localhost:4003");
})