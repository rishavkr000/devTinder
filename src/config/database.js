const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.MongoDB_String);
}

module.exports = connectDB;