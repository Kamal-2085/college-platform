import mongoose from "mongoose";

const savedcomparisonschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    comparisonKey: {
      type: String,
      required: true,
    },
    collegeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "college",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

savedcomparisonschema.index({ userId: 1, comparisonKey: 1 }, { unique: true });

export default mongoose.models.savedComparison ||
  mongoose.model("savedComparison", savedcomparisonschema);
