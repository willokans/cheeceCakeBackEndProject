const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

exports.signup = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  // if (userExist) {
  //   return next(new ErrorResponse("Email already exists", 400));
  // }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).json({
      //   success: false,
      //   message: "E-mail and password are required",
      // });
      return next(new ErrorResponse(`E-mail and password are required`, 400));
    }

    // check if email exist in the DB
    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid credentials",
      // });
      return next(new ErrorResponse(`Invalid credentials`, 400));
    }

    //verify the user password
    const isAMatch = await user.comparePassword(password);
    if (!isAMatch) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid credentials",
      // });
      return next(new ErrorResponse(`Invalid credentials`, 400));
    }

    generateToken(user, 200, res);
  } catch (error) {
    console.log(error);
    // return res.status(400).json({
    //   success: false,
    //   message: "Cannot log in, check your login credentials",
    // });
    return next(
      new ErrorResponse(`Cannot log in, check your login credentials`, 400)
    );
  }
};

const generateToken = async (user, statusCode, res) => {
  try {
    const token = await user.jwtGenerateToken();
    const options = {
      httpOnly: true,
      expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN),
    };

    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// LOG OUT USER
exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged Out!",
  });
};

exports.singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
