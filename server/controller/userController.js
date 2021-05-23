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


//PROFILE
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar:user.avatar
      })
    } 
  } catch (err) {
    return res.status(404).json({ msg: err.message });
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
      .populate("followers following", "-password");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Follow User
const followUser = async (req, res) => {
  try {
    const user = await User.find({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (user.length > 0)
      return res.status(500).json({ msg: "You followed this user." });

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: req.user._id },
      },
      { new: true, useFindAndModify: false  }
    ).populate("followers following", "-password");

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { following: req.params.id },
      },
      { new: true, useFindAndModify: false }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//unFollow User
const unFollowUser = async (req, res) => {
  try {

    const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
        $pull: {followers: req.user._id}
    }, {new: true, useFindAndModify: false }).populate("followers following", "-password")

    await User.findOneAndUpdate({_id: req.user._id}, {
        $pull: {following: req.params.id}
    }, {new: true, useFindAndModify: false })

    res.json({newUser})

} catch (err) {
    return res.status(500).json({msg: err.message})
}
};

export { signin, signup, profile, getUsers, getUser, followUser , unFollowUser};
