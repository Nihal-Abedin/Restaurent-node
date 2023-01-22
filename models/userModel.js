const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An user must have a name!"],
  },
  email: {
    type: String,
    required: [true, "An user must have An E-mail!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provise a valid Email!"],
  },
  role: {
    type: String,
    default: "employee",
    enum: ["employee", "admin"],
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, "Please provide your Password!"],
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true, "Please Confirm your Password!"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password's doesn't match!",
    },
  },
  upVotes: Array,
  downVotes: Array,
});
// pres SAVE before An User Signup to make the password hashed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
});
// userSchema.pre("save", async function (next) {
//   if (this.role === "admin") {
//     this.upVotes = undefined;
//     this.downVotes = undefined;
//   }
//   next();
// });
// Methods

// to check the given password is correct
userSchema.methods.correctPassword = function (hasedPassword, currentPassword) {
  return bcrypt.compare(currentPassword, hasedPassword);
};
const User = mongoose.model("User_X", userSchema);
// User.updateMany(
//   { upVotes: [] },
//   { downVotes: [] },
//   { multi: true },
//   function (err, numberAffected) {
//     if (!err) {
//       console.log("added");
//     }
//   }
// );
module.exports = User;
