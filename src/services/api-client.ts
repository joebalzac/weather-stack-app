import axios from "axios";

export default axios.create({
  baseURL: "https://api.weatherstack.com/current",
  params: {
    access_key: "1564be0cb85cb33498a59236df3d4c1a",
    query: "New York",
  },
});

