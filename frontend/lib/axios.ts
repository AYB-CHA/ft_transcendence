import Axios from "axios";
import Cookies from "js-cookie";

const APIClient = Axios.create({
  baseURL: process.env["NEXT_PUBLIC_BACKEND_BASEURL"],
  withCredentials: true,
});

APIClient.interceptors.request.use(
  function (config) {
    // config.headers.Authorization = "Bearer " + Cookies.get("access_token");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default APIClient;
