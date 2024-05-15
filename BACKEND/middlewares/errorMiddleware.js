import ApiError from "../exceptions/apiError.js";

export default (res, e) => {
  let message = e.message;
  let errors = e.errors;
  res.statusCode = e.status || 500;
  res.end(JSON.stringify({ message, errors }));
  return;
};
