const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad object id
  if (err.name === "CastError") {
    const message = "Resource not found!";
    error = new ErrorResponse(message, 404);
  }

  if (error.code === 11000) {
    const message = "Duplicate field value error!";
    error = new ErrorResponse(message, 404);
  }

  if (error.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 500);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
