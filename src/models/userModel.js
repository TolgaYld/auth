const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaTypes = Schema.Types;
const validator = require("validator");
const Post = require("./postModel");
const Comment = require("./commentModel");
const Report = require("./reportModel");
const { log } = require("../modules/logModule");

const UserSchema = new Schema(
  {
    email: {
      type: SchemaTypes.String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
    },
    password: {
      type: SchemaTypes.String,
      minLength: 9,
      required: true,
    },
    is_deleted: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    is_banned: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    email_confirmed: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    is_admin: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    last_update_from_user: {
      type: SchemaTypes.ObjectId,
    },
  },
  { collection: "Users", timestamps: true },
);

UserSchema.post("findOneAndDelete", async function (next) {
  try {
    let user = this;
    await Post.deleteMany({ user: user.getFilter()._id }, next);
    await Comment.deleteMany({ user: user.getFilter()._id }, next);
    await Report.deleteMany({ reported_user: user.getFilter()._id }, next);
  } catch (error) {
    log("error: " + error);
  }
});

UserSchema.post("findOneAndUpdate", async function (next) {
  try {
    let user = this;

    if (user.getUpdate().$set.is_deleted) {
      await Post.updateMany(
        { user: user.getFilter()._id },
        { is_deleted: true },
        next,
      );
      await Comment.updateMany(
        { user: user.getFilter()._id },
        { is_deleted: true },
        next,
      );
      await Report.updateMany(
        { reported_user: user.getFilter()._id },
        { is_deleted: true },
        next,
      );
    }

    if (user.getUpdate().$set.is_banned) {
      await Post.updateMany(
        { user: user.getFilter()._id },
        { is_active: true },
        next,
      );
      await Comment.updateMany(
        { user: user.getFilter()._id },
        { is_active: true },
        next,
      );
      await Report.updateMany(
        { reported_user: user.getFilter()._id },
        { is_active: true },
        next,
      );
    }
  } catch (error) {
    log("error: " + error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
