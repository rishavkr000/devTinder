const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true, // This is not working in my case
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    // enum: ["Male", "Female", "Other"],
    validate(value) {
      if(!["male", "female", "other"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    }
  },
  about: {
    type: String,
    default: "This is the default about me",
  }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
