import mongoose from "mongoose";

const detailedcollegeschema =
  new mongoose.Schema({
    name: String,

    overview: String,

    courses: [String],

    placements: String,

    reviews: [String],
  });

export default mongoose.models
  .detailedcollege ||
  mongoose.model(
    "detailedcollege",
    detailedcollegeschema
  );