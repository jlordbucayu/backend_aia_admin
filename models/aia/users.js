const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password must be 7 or more "password"');
      }
    },
  },
});



usersSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.profile;

  return userObject;
};

usersSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { u: user.name, email: user.email, uuid: user._id.toString() },
    "magetech_avyan"
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

usersSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
usersSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
