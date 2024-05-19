export default (req) => {
  const urlParams = req.url.substring(req.url.indexOf("?") + 1);
  console.log(urlParams);
  if (urlParams) {
    const params = new URLSearchParams(urlParams);
    return Object.fromEntries(params.entries());
  }
  return {};
};
