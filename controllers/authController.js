const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const { promisify } = require("util");
const generateJWT = (newUser) => {
  return jwt.sign({ id: newUser }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  });
  const token = generateJWT(newUser.id);
  res.status(201).json({
    status: 201,
    message: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      new AppError("Please provide both your Email and Password", 400)
    );
  }
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (
    !user ||
    !(await user.correctPassword(user.password, req.body.password))
  ) {
    return next(new AppError("Invalid Email or Password!", 401));
  }
  const token = generateJWT(user._id);
  res.status(200).json({
    status: 200,
    message: "success",
    token,
    data: {
      user,
    },
  });
});

exports.authMiddleware = catchAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    next(new AppError("You are not logged in, Please login to access!", 400));
  }
  // console.log(token);
  const decodedValue = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const user = await User.findById(decodedValue.id);
  if (!user) {
    return next(new AppError("Please to login to get access!", 401));
  }
  req.user = user;
  // console.log(user);
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Your are not authorizes to access this route!", 401)
      );
    }
    next();
  };
};
