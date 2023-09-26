import Axios from "axios";
import Cookies from "js-cookie";

const axios = Axios.create({
  baseURL: process.env["NEXT_PUBLIC_BACKEND_BASEURL"],
});

axios.defaults.headers.common["Authorization"] =
  "Bearer " + Cookies.get("access_token");

export default axios;
