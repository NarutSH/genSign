import axios from "axios";

export const dsmApi = axios.create({
  baseURL: "https://dmsdev.beesuite.co/ecm/api/multi/png/sign/save",
  headers: {
    "Content-Type": "application/json",
  },
});
