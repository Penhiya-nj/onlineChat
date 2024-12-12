const express = require("express");
const createError = require("http-errors");

const errorHandler = (err, req, res, next) => {
  // Default error response structure
  const errorResponse = {
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  };
 
  // Additional details for development
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    //delete errorResponse.message;
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || {};
    errorResponse.errorLevel = err.level || "unknown";
  }

  // Log the error for debugging purposes
  // console.log(err);

  // Send the error response
  res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandler;
