export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
    details: error.details || null,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};
