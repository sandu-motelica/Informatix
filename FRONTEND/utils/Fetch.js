const _apiHost = "http://localhost:3000";

async function request(url, params = {}, method = "GET") {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // origin: "http://localhost:3000",
    },
    // credentials: "include",
  };

  if (params) {
    if (method === "GET") {
      url += "?" + objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }
  }

  const response = await fetch(_apiHost + url, options);
  // if (response.status === 401) return updateAccessToken();
  if (response.status === 401) localStorage.clear();

  const result = await response.json();
  result.statusCode = response.status;

  return result;
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

function get(url, params) {
  return request(url, params);
}

function create(url, params) {
  return request(url, params, "POST");
}

function update(url, params) {
  return request(url, params, "PUT");
}

function remove(url, params) {
  return request(url, params, "DELETE");
}

export default {
  get,
  create,
  update,
  remove,
};
