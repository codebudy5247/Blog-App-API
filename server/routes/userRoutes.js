import express from "express";
const router = express.Router();

import {
  signin,
  signup,
  updateUser,
  searchUser,
  suggestedUsers,
  getUsers,
  getUser,
  followUser,
  unFollowUser,
} from "../controller/userController.js";
import Auth from "../middleware/auth.js";


router.post("/signin", signin);
router.post("/signup", signup);
router.get("/", getUsers);
router.get('/search', Auth, searchUser)
router.patch('/updateUser',updateUser) //Error
router.get("/:id", Auth, getUser);
router.put("/:id/follow", Auth, followUser);
router.put("/:id/unfollow", Auth, unFollowUser);
router.get('/suggestedUser', Auth, suggestedUsers);

export default router;
