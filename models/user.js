const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a name"],
      maxlength: 32,
    },

    role: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Please add password"],
      minlength: [
        6,
        "Password must have at least eight characters, at least one letter and one number",
      ],
      match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password my match eight characters, at least one letter and one number",
      ],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add valid email address",
      ],
    },
  },
  { timestamp: true }
);

// Encrpting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//verify passwordß
userSchema.methods.comparePassword = async function (yourpassword) {
  return await bcrypt.compare(yourpassword, this.password);
};

// get the token
userSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
};

module.exports = mongoose.model("User", userSchema);
