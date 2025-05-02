const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.mongoDB_String);
}

module.exports = connectDB;