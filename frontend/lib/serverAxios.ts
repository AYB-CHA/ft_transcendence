import Axios from "axios";

const serverAxios = Axios.create({
  baseURL:
    process.env["ENVIRONMENT"] === "develop"
      ? process.env["NEXT_PUBLIC_BACKEND_BASEURL"]
      : "http://backend:4000",
});

export default serverAxios;
