/** @format */

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const httpProxy = createProxyMiddleware({
  target: "http://10.1.0.83:8000/",
  changeOrigin: true,
  secure: false,
});

app.use("/api", httpProxy);

app.listen(8002);
