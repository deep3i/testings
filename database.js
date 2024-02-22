const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://3developer3i:deephdeeph@cluster0.n3gmnf6.mongodb.net/productdb`, {
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