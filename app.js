const express = require("express");
const app = express();
app.use(express.json());
// console.log(process.env);
const userRoutes = require("./routes/userRoutes");
const reataurentRoutes = require("./routes/restaurentRoutes");
const globalErrorHandeler = require("./controllers/errorController");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/restaurents", reataurentRoutes);
app.use(globalErrorHandeler);
module.exports = app;
