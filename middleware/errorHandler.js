export function notFound(_req, res) {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
}

export function errorHandler(err, _req, res, _next) {
  console.error('Error:', err.message);

  const status = err.statusCode || 500;
  const message =
    status === 500
      ? 'Failed to send message. Please try again later or contact us directly.'
      : err.message;

  res.status(status).json({
    success: false,
    message,
  });
}
