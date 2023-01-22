const mongoose = require("mongoose");

const restaurentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Restaurent must have a name!"],
    unique: true,
  },
});

const Restaurent = mongoose.model("restaurent", restaurentSchema);

module.exports = Restaurent;
