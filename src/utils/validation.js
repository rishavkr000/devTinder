const validator = require("validator");

const signUpValidation = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please provide all the required fields");
    }

    if (firstName.length > 20) {
        throw new Error("First name must not be greater that 20 characters");
    }

    if (lastName.length > 20) {
        throw new Error("Last name must not be greater than 20 characters");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

const profileEditFieldValidate = (req) => {
    const { firstName, lastName, email, age, profileUrl } = req.body;
    const allowedEditField = ["firstName", "lastName", "email", "age", "gender", "about", "skills", "profileUrl"]

    if (firstName) {
        if (firstName.length > 20) {
            throw new Error("First name must not be greater than 20 characters.")
        }
    }

    if (lastName) {
        if (lastName.length > 20) {
            throw new Error("Last name must not be greater than 20 characters.")
        }
    }

    if (email) {
        if (!validator.isEmail(email)) {
            throw new Error("Email is not valid")
        }
    }

    if (profileUrl) {
        if (!validator.isURL(profileUrl)) {
            throw new Error("Profile URL is not valid url")
        }
    }

    const isFieldAllowedForEdit = Object.keys(req.body).every(field => allowedEditField.includes(field));

    return isFieldAllowedForEdit;
}

module.exports = { signUpValidation, profileEditFieldValidate };