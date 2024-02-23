require("dotenv").config()
const mongoose = require('mongoose');
const uri = `mongodb+srv://3developer3i:deephdeeph@cluster0.n3gmnf6.mongodb.net/productdb`;
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        // conn()
        console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };
