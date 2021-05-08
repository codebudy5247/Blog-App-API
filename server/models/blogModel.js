import mongoose from "mongoose";
import marked from "marked";
import createDomPurify from "dompurify";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const dompurify = createDomPurify(new JSDOM().window);

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  likeCount: {
    type: [String],
    default: [],
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  
  createdAt: {
    type: Date,
    default: new Date(),
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

postSchema.pre("validate", function (next) {
  if (this.message) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.message));
  }

  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;

// user: {
//   type: mongoose.Schema.Types.ObjectId,
//   required: true,
//   ref: 'User',
// },
