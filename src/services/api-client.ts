import axios from "axios";

export default axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0",
  params: {
    appid: "07c9e65ab628c0e13cc796ae25d8ec4c",
  },
});
