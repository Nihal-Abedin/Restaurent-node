const catchAsync = require("../utils/catchAsync");
const Menu = require("../models/menuModel");
const User = require("../models/userModel");

const calculateVotes = async (voteStatus, user) => {
  const menus = await Menu.find();
  let votedMenus;
  if (voteStatus === "true") {
    votedMenus = menus.filter((m, i) => {
      if (user.upVotes.includes(m._id)) return m;
    });
  }
  if (voteStatus === "false") {
    votedMenus = menus.filter((m, i) => {
      if (user.downVotes.includes(m._id)) return m;
    });
  }
  return votedMenus;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.status(200).json({
    status: 200,
    totalUsers: users.length,
    users,
  });
});
exports.getUserDetails = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const { vote } = req.query;
  let votedMenus;
  if (vote) {
    votedMenus = await calculateVotes(vote, req.user);
    res.status(200).json({
      status: 200,
      totalVotes: votedMenus.length,
      data: {
        votedMenus,
      },
    });
    return;
  }
  //   console.log(votedMenus);
  res.status(200).json({
    status: 200,
    data: {
      user: req.user,
    },
  });
});
