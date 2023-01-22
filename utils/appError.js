class AppError extends Error {
  constructor(message, statusCode, messageArray = []) {
    super(message);

    this.statusCode = statusCode;
    this.messageArray = messageArray;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.conctructor);
  }
}
module.exports = AppError;
