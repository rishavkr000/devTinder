const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
    validate(value) {
      if(validator.isEmpty(value)) {
        throw new Error("First name cannot be empty");
      }
    }
  },
  lastName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
    validate(value) {
      if(validator.isEmpty(value)) {
        throw new Error("Last name cannot be empty");
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true, // This is not working in my case
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not strong enough");
      }
    }
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
  },
  profileUrl: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Profile URL is not valid");
      }
    }
  }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
