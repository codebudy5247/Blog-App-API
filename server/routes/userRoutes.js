import express from "express";
const router = express.Router();

import {
  signin,
  signup,
  profile,
  getUsers,
  getUser,
  followUser,
  unFollowUser,
} from "../controller/userController.js";
import Auth from "../middleware/auth.js";

router.get("/", Auth, getUsers);
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/profile", Auth,profile );
router.get("/:id", Auth, getUser);
router.patch("/:id/follow", Auth, followUser);
router.patch("/:id/unfollow", Auth, unFollowUser);

export default router;
