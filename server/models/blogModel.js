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
  creator:{type: mongoose.Types.ObjectId, ref: 'User'},
  //likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  likes: { type: [String], default: [] },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
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

postSchema.methods.toJSONFor = function(user){
  return {
    
    title: this.title,
    message: this.message,
    tags: this.tags,
    selectedFile:this.selectedFile,
    createdAt: this.createdAt,
    sanitizedHtml:this.sanitizedHtml,
    creator: this.creator.toProfileJSONFor(user)
  };
};

const Post = mongoose.model("Post", postSchema);
export default Post;

// user: {
//   type: mongoose.Schema.Types.ObjectId,
//   required: true,
//   ref: 'User',
// },
