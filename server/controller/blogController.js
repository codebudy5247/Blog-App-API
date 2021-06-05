import mongoose from "mongoose";
import Post from "../models/blogModel.js";

//Fetch all posts
// const getPosts = async (req, res) => {
//   try {
//     const post = await Post.find();

//     res.status(200).json(post);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };
const getPosts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Post.countDocuments({ ...keyword });
  try {
    const posts = await Post.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({ posts, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Get post by id
const getPost = async (req, res) => {
  
  const post = await Post.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const post = new Post({
    title: "Sample name",
    message: "<p>Tell Your Story HTML Syntax</p>",
    user:req.user,
    tags: "[sample tag,tag1]",
    selectedFile: "/images/post.jpg",
    createdAt: new Date().toISOString(),
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

//Update a post
const updatePost = async (req, res) => {
  const { title, message, selectedFile, tags } = req.body;
  const postFields = {};
  if (title) postFields.title = title;
  if (message) postFields.message = message;
  if (selectedFile) postFields.selectedFile = selectedFile;
  if (tags) postFields.tags = tags;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(401).json({ msg: "post not found" });
    }
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: postFields,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(401).send("server error");
  }
};

//Delete a Post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Post.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

//Like a post
const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await Post.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await Post.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

export { getPosts, getPost, createPost, updatePost, deletePost, likePost };
