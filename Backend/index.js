const express = require("express");
const app = express();
const port = 232
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/vitalApp?directConnection=true',()=>{
    console.log("connetced databse");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.get("/", (req, res) => {
//     res.send("hii iam deep")
// })

const formSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const Form = mongoose.model('form', formSchema);

//EndPoint
app.post("/api/contact",  (req, res) => {
    //    res.status(200).send(req.body)
    console.log(req.body);
    res.status(200).send(req.body);
    // const form = new Form(req.body);
    // form.save().then(() => {
    //     res.send("save data successfully")
    // }).catch((err) => {
    //     console.log("error save form in database", err);
    //     res.send("note save")
    // })
})


app.listen(port, () => {
    console.log(`server start on http://localhost:${port}`);
})