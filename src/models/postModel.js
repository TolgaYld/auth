const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaTypes = Schema.Types;

const PostSchema = new Schema(
  {
    is_deleted: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    is_active: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
  },
  { collection: "Posts", timestamps: true },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
