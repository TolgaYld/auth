const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({});

const Comment = mongoose.model("Comment", CommentSchema, "Comments");

module.exports = Comment;
