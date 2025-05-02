const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rishavkr000:bestpasswordofrishav@cluster0.g45uf0k.mongodb.net/devTinder');
}

module.exports = connectDB;