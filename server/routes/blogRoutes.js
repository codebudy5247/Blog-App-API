import express from "express";
const router = express.Router();
import Auth from "../middleware/auth.js";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controller/blogController.js";

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", Auth, createPost);
router.patch("/:id", Auth, updatePost);
router.delete("/:id", Auth, deletePost);
router.patch("/:id/likePost", Auth, likePost);

export default router;
