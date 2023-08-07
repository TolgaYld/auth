const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaTypes = Schema.Types;
const validator = require("validator");

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
    last_update_from_user_id: {
      type: SchemaTypes.UUID,
    },
  },
  { collection: "Users", timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
