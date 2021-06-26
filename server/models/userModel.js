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

userSchema.methods.toProfileJSONFor = function(user){
  return {
    name: this.name,
    avatar: this.avatar || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    
  };
};

const User = mongoose.model("User", userSchema);
export default User;
