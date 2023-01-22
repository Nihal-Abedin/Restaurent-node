const AppError = require("../utils/appError");

const sendResDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const sendResProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      validations: err.messageArray,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
const handleTokenExpireError = () => {
  return new AppError("Your Token is expired, Please Login again!", 401);
};
const handleTokenError = () => {
  return new AppError("Invalid Token! Please Login!", 401);
};
const handleDuplicateValues = (err) => {
  console.log(err);
  const message = `User with this ${Object.keys(
    err.keyValue
  )} : ${Object.values(err.keyValue)} already exists`;
  console.log(message);
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  let messageArray = [];
  for (let i in err.errors) {
    messageArray.push({
      [i]: err.errors[i].message,
    });
    // console.log(i);
  }
  // console.log(messageArray);
  return new AppError("Invalid inputs", 400, messageArray);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // console.log(err);
  if (process.env.NODE_ENV === "development") {
    sendResDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // if(error.code)
    if (err.name === "TokenExpiredError") {
      error = handleTokenExpireError();
    }
    if (err.name === "JsonWebTokenError") {
      error = handleTokenError();
    }
    if (err.name === "ValidationError") {
      error = handleValidationError(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateValues(error);
    }
    sendResProd(error, res);
  }
};
