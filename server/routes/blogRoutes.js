import express from "express";
const router = express.Router();
import Auth from "../middleware/auth.js";

import {
  getPosts,
  getPost,
  createPost,
  addPost,
  updatePost,
  deletePost,
  likePost,
  topPost
} from "../controller/blogController.js";

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/top",topPost)
router.post("/", Auth, createPost);
router.post("/add-post", Auth, addPost);
router.put("/:id", Auth, updatePost);
router.delete("/:id", Auth, deletePost);
router.patch("/:id/likePost", Auth, likePost);

export default router;
