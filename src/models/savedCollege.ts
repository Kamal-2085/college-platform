import mongoose from "mongoose";

const savedcollegeschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "college",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedcollegeschema.index({ userId: 1, collegeId: 1 }, { unique: true });

export default mongoose.models.savedCollege ||
  mongoose.model("savedCollege", savedcollegeschema);
