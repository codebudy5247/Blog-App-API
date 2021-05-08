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
    // myPosts:[
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Post",
    //   }
    // ]
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User
