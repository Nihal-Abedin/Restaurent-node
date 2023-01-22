const mongoose = require("mongoose");
const validator = require("validator");

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A menu must have a title!"],
    // unique: true,
  },
  ingrediants: {
    type: Array,
    required: [true, "Please provide ingrediants"],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [1, "Minimun rating is 1.0"],
    max: [5, "Maxmimum rating is 5.0"],
  },
  restaurentName: {
    type: String,
  },
  referenceId: {
    type: String,
    require: [true, "A menu must represent an Restaurent!"],
    // select: false,
  },
  servesOn: {
    type: String,
    require: [true, "Please define to serve this menu."],
    // default: Date.now(),
  },
  upVotes: {
    type: Number,
    default: 0,
    min: [0, "Minimum vote is 0"],
  },
  downVotes: {
    type: Number,
    default: 0,

    min: [0, "Minimum vote is 0"],
  },
});
// menuSchema.pre("save", function (next) {
//   const date = new Date();
//   // date.setDate(date.getDate() - 1);
//   const formatedDate = new Intl.DateTimeFormat("en-US", {
//     weekday: "long",
//   }).format(date);
//   // console.log(formatedDate);
//   this.servesOn = formatedDate.toLowerCase();
//   next();
// });
// menuSchema.pre("save", function (next) {

//   next();
// });
menuSchema.methods.CountVote = function (vote) {
  if (vote) {
    this.upVotes += 1;
    if (this.downVotes >= 1) this.downVotes -= 1;
    return true;
  } else {
    this.downVotes += 1;
    if (this.upVotes >= 1) this.upVotes -= 1;
    return false;
  }
};
// menuSchema.pre(/^find/, async function (next) {
//   this.upVotes = 0;
//   this.downVotes = 0;
//   next();
// });

// menuSchema.pre(/^find/, function () {
//   this.find().select("+referenceId");
// });
const Menu = mongoose.model("menu", menuSchema);
// Menu.updateMany(
//   {},
//   { $rename: { createdAt: "servesOn" } },
//   { multi: true },
//   function (err, blocks) {
//     if (err) {
//       throw err;
//     }
//     console.log("done!");
//   }
// );
// Menu.updateMany(
//   { upVotes: 0 },
//   { downVotes: 0 },
//   { multi: true },
//   function (err, numberAffected) {
//     if (!err) {
//       console.log("added");
//     }
//   }
// );
// Menu.update({ upVotes: 0 }, { $unset: { field: 1 } }, () => {});

module.exports = Menu;
