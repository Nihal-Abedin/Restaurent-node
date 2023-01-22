const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const app = require("./app");
console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log("DB successfully connected!");
});
const port = 3000;
app.listen(port, () => {
  console.log(`App Listening on port:${port}`);
});
