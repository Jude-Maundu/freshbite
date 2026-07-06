const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((entry) => entry.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with that unique value already exists.';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
