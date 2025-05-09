const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 20,
    validate(value) {
      if(validator.isEmpty(value)) {
        throw new Error("First name cannot be empty");
      }
    }
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 20,
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
    type: Number
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
  skills: {
    type: [String]
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


userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({_id: user._id}, "DevTinder@Rishav", {expiresIn: "7d"});
  return token;
}

userSchema.methods.validatePassword = async function (passwordEnterByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordEnterByUser, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
