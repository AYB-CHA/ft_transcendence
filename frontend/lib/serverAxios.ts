import Axios from "axios";

const serverAxios = Axios.create({
  baseURL: "http://backend:4000",
});

export default serverAxios;
