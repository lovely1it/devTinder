const mongoose = require("mongoose");
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
  },
  password: {
    type: String,
    required: true,
    unique: true,
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
