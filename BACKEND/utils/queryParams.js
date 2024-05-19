import parseBoolean from "./parseBoolean.js";
export default (req) => {
  const urlParams = req.url.substring(req.url.indexOf("?") + 1);
  if (urlParams) {
    const params = new URLSearchParams(urlParams);
    const objParams = Object.fromEntries(params.entries());
    for (const item in objParams) {
      let val = parseBoolean(objParams[item]);
      if (val != undefined) objParams[item] = val;
    }
    return objParams;
  }
  return {};
};
