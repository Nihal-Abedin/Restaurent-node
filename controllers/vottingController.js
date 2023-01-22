const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Menu = require("../models/menuModel");
const VoteHistory = require("../models/voteHistorymodel");
const CreateVoteHistory = async (obj) => {
  const newHistory = await VoteHistory.create(obj);
  return newHistory;
};
exports.vottingAMenu = catchAsync(async (req, res, next) => {
  const { menuId, vote } = req.body;

  //   console.log(menuId);
  const user = await User.findById(req.user.id);
  const menu = await Menu.findById(menuId);
  if (!menu) {
    return next(new AppError("There is no menu with this id!", 400));
  }

  const voteExists = await VoteHistory.find({
    foriegnUserId: req.user.id,
    foriegnMenuId: menuId,
  });
  let newVottstatusingHistory;
  console.log(voteExists, "hh");
  if (voteExists.length === 0) {
    newVottstatusingHistory = await VoteHistory.create({
      foriegnMenuId: menuId,
      foriegnUserId: req.user.id,
      status: vote ? 1 : 0,
    });

    if (vote === false) {
      menu.downVotes += 1;
      user.downVotes.push(menuId);
    }
    if (vote === true) {
      menu.upVotes += 1;
      user.upVotes.push(menuId);
    }
    user.save({ validateBeforeSave: false });
    menu.save({ validateBeforeSave: false });
    //   console.log(menu);
    res.status(201).json({
      message: "This Route is in development",
      newVottstatusingHistory,
    });
    return;
  }
  if (
    (vote && voteExists[0].status === 1) ||
    (!vote && voteExists[0].status === 0)
  ) {
    return res.status(200).json({
      status: 200,
      message: "Updated!",
    });
  }
  const updateVote = await VoteHistory.findByIdAndUpdate(
    voteExists[0].id,
    {
      status: vote ? 1 : 0,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (vote === false && !menu.CountVote(vote)) {
    user.upVotes.pop(menuId);
    user.downVotes.push(menuId);
  }
  if (vote === true && menu.CountVote(vote)) {
    user.downVotes.pop(menuId);
    user.upVotes.push(menuId);
  }
  // const menu = await Menu.findById(menuId);
  // if (!menu) {
  //   return next(new AppError("There is no menu with this id!", 400));
  // }
  // if (upVote) {
  //   menu.upVotes.push(req.user.id);
  // }
  // if (downVote) {
  //   menu.downVotes.push(req.user.id);
  // }
  updateVote.save();
  user.save({ validateBeforeSave: false });
  menu.save({ validateBeforeSave: false });
  // console.log(menu);
  res.status(200).json({
    status: 200,
    message: "Updated!",
  });
});
