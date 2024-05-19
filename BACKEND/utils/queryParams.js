export default (req) => {
  const urlParams = req.url.substring(req.url.indexOf("?") + 1);

  if (urlParams) {
    const params = new URLSearchParams(urlParams);
    return Object.fromEntries(params.entries());
  }
  return {};
};
