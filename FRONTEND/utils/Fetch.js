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

  const result = await response.json();
  result.statusCode = response.status;

  return result;
}

// const updateAccessToken = async (url, params, method) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       // Origin: "http://localhost:3000",
//     },
//     credentials: "include",
//   };

//   const response = await fetch(_apiHost + "/user/refresh", options);
//   const data = await response.json();
//   console.log(data.status);
//   if (data.message == "Unauthorized") {
//     // alert(1);
//     // localStorage.clear();
//     // window.location = "/";
//   } else {
//     localStorage.setItem("user", JSON.stringify(data.user));
//     localStorage.setItem("token", data.accessToken);
//     request(url, params, method);
//   }
// };

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
