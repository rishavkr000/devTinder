const validator = require("validator");

const signUpValidation = (req) => {
    const { firstName, lastName, email, password} = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please provide all the required fields");
    }

    if (firstName.length < 4 || firstName.length > 10) {
        throw new Error("First name must be between 4 and 10 characters");
    }


    if (lastName.length < 4 || lastName.length > 10) {
        throw new Error("Last name must be between 4 and 10 characters");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

module.exports = {signUpValidation};