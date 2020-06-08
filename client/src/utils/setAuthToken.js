import React from "react";
import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token1"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token1"];
  }
};

export default setAuthToken;
