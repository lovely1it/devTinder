const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 100,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Address "+ value);
        }
    }
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("weak password! "+ value);
        }
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid!");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "photoUrl by default will be added!",
    // validate(value){
    //     if(!validator.isURL(value)){
    //         throw new Error("Invalid photo URL Address "+ value);
    //     }
    // }
  },
  about: {
    type: String,
    default: "Developer for devTinder.",
  },
  skills: {
    type: [String],
  },
 
}, {timestamps: true});
module.exports = mongoose.model("User", userSchema);
