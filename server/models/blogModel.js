import mongoose from "mongoose";
import marked from "marked";
import createDomPurify from "dompurify";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const dompurify = createDomPurify(new JSDOM().window);

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  tags: [String],
  selectedFile: String,
  // likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  // comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
  user: { type: mongoose.Types.ObjectId, ref: "User",required: true },

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
