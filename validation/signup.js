const Validator = require("validator");
const isEmpty = require("./isEmpty.js");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 4, max: 30 })) {
    errors.name = "it is inalid name";
  }
  // validate user name is not empty
  if (Validator.isEmpty(data.name)) {
    errors.name = "name is requierd";
  }
  // check the length for user

  if (!Validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "email is requierd";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 16 })) {
    errors.password = "password should be between 8 and 16 character";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password is requierd";
  }

  if (!Validator.equals(data.password2, data.password)) {
    errors.password = " Passwords must match ";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password = "passwords is requierd";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
