const express = require("express");
const cors = require("cors")
const bodyparser = require("body-parser")
const app = express();
const port = 8080

const allowedOrigins = ['https://mern-eccomerce-kk97-ewtsj7up3-deep3i.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } 
};

app.use(cors(corsOptions));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", require("./routes"));

app.get("/", (req, res) => {
    res.send("okk done livenoidejs ")
});

app.listen(port, () => {
    console.log(`run at http://localhost:${port}`);
});
