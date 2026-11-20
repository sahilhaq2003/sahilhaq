import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    type: { type: String, default: "Other", maxlength: 60 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
    read: { type: Boolean, default: false },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
