export const success = (res, data = null, message = 'OK', statusCode = 200, meta = undefined) =>
  res.status(statusCode).json({ success: true, message, data, meta });

export const fail = (res, message = 'Request failed', statusCode = 400, details = undefined) =>
  res.status(statusCode).json({ success: false, message, details });
