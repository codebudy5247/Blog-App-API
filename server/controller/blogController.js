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
    message: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
    creator:req.user,
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
  // const { title, message, selectedFile, tags } = req.body;
  // const postFields = {};
  // if (title) postFields.title = title;
  // if (message) postFields.message = message;
  // if (selectedFile) postFields.selectedFile = selectedFile;
  // if (tags) postFields.tags = tags;

  // try {
  //   let post = await Post.findById(req.params.id);
  //   if (!post) {
  //     return res.status(401).json({ msg: "post not found" });
  //   }
  //   post = await Post.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       $set: postFields,
  //     },
  //     { new: true, useFindAndModify: false }
  //   );
  //   res.status(200).json(post);
  // } catch (error) {
  //   console.log(error.message);
  //   res.status(401).send("server error");
  // }
  const {
    title,
    message,
    tags,
    selectedFile,
  } = req.body

  const post = await Post.findById(req.params.id)

  if (post) {
    post.title = title
    post.message = message
    post.tags = tags
    post.selectedFile = selectedFile
    

    const updatedPost = await post.save()
    res.json(updatedPost)
  } else {
    res.status(404).send("Post Not Found");
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
