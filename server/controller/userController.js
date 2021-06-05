import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

//SIGNUP
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(201).json({ msg: "Register Success!", result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

//SIGNIN
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "11h",
      }
    );

    res.status(200).json({ msg: "Login Success!", result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//SEARCH User
const searchUser = async (req, res) => {
  try {
    const users = await User.find({ name: { $regex: req.query.name } })
      .limit(10)
      .select("name  bio avatar");

    res.json({ users });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Update User
const updateUser = async (req, res) => {

  try {
    const {
      avatar,
      bio,
      website,
      githubLink,
      linkedinLink,
      facebookLink,
      twitterLink,
      hashnodeLink,
    } = req.body;

    await User.findOneAndUpdate({ _id: req.user._id }, {
      avatar,
      bio,
      website,
      githubLink,
      linkedinLink,
      facebookLink,
      twitterLink,
      hashnodeLink,
    })

    res.json({ msg: "Update Success!" })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }



}


//Get All Users
const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

//Get User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers followings", "-password");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Follow User
const followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
  // try {
  //   const user = await User.find({
  //     _id: req.params.id,
  //     followers: req.user._id,
  //   });
  //   if (user.length > 0)
  //     return res.status(500).json({ msg: "You followed this user." });

  //   const newUser = await User.findOneAndUpdate(
  //     { _id: req.params.id },
  //     {
  //       $push: { followers: req.user._id },
  //     },
  //     { new: true, useFindAndModify: false  }
  //   ).populate("followers following", "-password");

  //   await User.findOneAndUpdate(
  //     { _id: req.user._id },
  //     {
  //       $push: { following: req.params.id },
  //     },
  //     { new: true, useFindAndModify: false }
  //   );

  //   res.json({ newUser });
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
};

//unFollow User
const unFollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
  // try {
  //   const newUser = await User.findOneAndUpdate(
  //     { _id: req.params.id },
  //     {
  //       $pull: { followers: req.user._id },
  //     },
  //     { new: true, useFindAndModify: false }
  //   ).populate("followers following", "-password");

  //   await User.findOneAndUpdate(
  //     { _id: req.user._id },
  //     {
  //       $pull: { following: req.params.id },
  //     },
  //     { new: true, useFindAndModify: false }
  //   );

  //   res.json({ newUser });
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
};

//Get User Suggestion
const suggestedUsers = async (req, res) => {
  try {
    const newArr = [...req.user.followings, req.user._id];

    const num = req.query.num || 10;

    const users = await User.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followings",
          foreignField: "_id",
          as: "followings",
        },
      },
    ]).project("-password");

    return res.json({
      users,
      result: users.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export {
  signin,
  signup,
  searchUser,
  updateUser,

  getUsers,
  getUser,
  followUser,
  unFollowUser,
  suggestedUsers,
};
