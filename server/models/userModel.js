import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: { type: String, default: "" },
    githubLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    hashnodeLink: {
      type: String,
    },
    // followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    // following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
     },
    saved: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
