import ApiError from "../exceptions/apiError.js";

export default (res, e) => {
  let message = e.message;
  let errors = e.errors;
  let status = e.status || 500;
  res.statusCode = e.status;
  res.end(JSON.stringify({ message, errors }));
  return;
};
