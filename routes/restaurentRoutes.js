const express = require("express");
const router = express.Router();
const {
  createRestaurent,
  createMenu,
  getAllMenu,
  getAllRes,
} = require("../controllers/restaurentController");
const { authMiddleware, restrictTo } = require("../controllers/authController");
const { vottingAMenu } = require("../controllers/vottingController");
router.post(
  "/createRestaurent",
  authMiddleware,
  restrictTo("admin"),
  createRestaurent
);
router.patch(
  "/vote-menu",
  authMiddleware,
  restrictTo("employee"),
  vottingAMenu
);
router.route("/").get(authMiddleware, getAllRes);
// router.route("/today-menu").get(authMiddleware, getTodaysMenu);
// .patch(authMiddleware, restrictTo("employee"), vottingAMenu);
router
  .route("/:restaurentId")
  .post(authMiddleware, restrictTo("admin"), createMenu)
  .get(authMiddleware, getAllMenu)
  .patch(authMiddleware, restrictTo("employee"), vottingAMenu);

module.exports = router;
