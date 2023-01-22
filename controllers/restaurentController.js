const catchAsync = require("../utils/catchAsync");
const Restaurent = require("../models/retaurentModel");
const AppError = require("../utils/appError");
const Menu = require("../models/menuModel");

exports.createRestaurent = catchAsync(async (req, res, next) => {
  const newReataurent = await Restaurent.create({
    name: req.body.name,
  });
  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      restaurent: newReataurent,
    },
  });
});
exports.getAllRes = catchAsync(async (req, res, next) => {
  const allRes = await Restaurent.find();

  res.status(200).json({
    status: "success",
    data: {
      restaurents: allRes,
    },
  });
});

exports.createMenu = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  const restaurant = await Restaurent.findById(req.params.restaurentId);
  if (!restaurant) {
    return next(new AppError("Restaurant Not Found!", 400));
  }
  // console.log(restaurant);
  const menuExists = await Menu.findOne({
    title: req.body.title,
    referenceId: req.params.restaurentId,
    servesOn: req.body.servesOn,
  });
  if (menuExists) {
    return next(
      new AppError(
        `This menu already exists for ${req.body.servesOn} in this Restaurent!`,
        400
      )
    );
  }
  const newMenu = await Menu.create({
    title: req.body.title,
    ingrediants: req.body.ingrediants,
    restaurentName: restaurant.name,
    referenceId: req.params.restaurentId,
    rating: req.body.rating,
    servesOn: req.body.servesOn,
  });
  res.status(201).json({
    status: 201,
    message: "success",
    data: {
      menu: newMenu,
    },
  });
});
exports.getAllMenu = catchAsync(async (req, res, next) => {
  const { day } = req.query;

  // const menus = await Menu.find({
  //   $or: [{ referenceId: req.params.restaurentId }, { servesOn: "Monday" }],
  // });
  let menus;
  if (day) {
    menus = await Menu.find({
      referenceId: req.params.restaurentId,
      servesOn: day?.toLowerCase(),
    });
  } else {
    menus = await Menu.find({
      referenceId: req.params.restaurentId,
    });
  }
  res.status(200).json({
    message: "success",
    data: {
      menu: menus,
    },
  });
});
