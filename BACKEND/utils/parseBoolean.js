export default (string) => {
  switch (String(string).toLowerCase()) {
    case "true":
    case "1":
      return true;
    case "false":
    case "0":
    case "null":
    case "undefined":
      return false;
    default:
      return undefined;
  }
};
