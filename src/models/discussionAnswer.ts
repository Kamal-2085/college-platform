import mongoose from "mongoose";

const discussionanswerschema = new mongoose.Schema(
  {
    discussionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discussion",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.discussionanswer ||
  mongoose.model("discussionanswer", discussionanswerschema);
