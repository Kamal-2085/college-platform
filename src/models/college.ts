import mongoose from "mongoose";

const collegeschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  location: {
    type: String,
  },

  fees: {
    type: Number,
  },

  rating: {
    type: Number,
  },

  description: {
    type: String,
  },

  imageurl: {
    type: String,
  },

  overview: {
    type: String,
  },

  courses: [
    {
      type: String,
    },
  ],

  reviews: [
    {
      type: String,
    },
  ],

  placements: {
    type: String,
  },
});

export default mongoose.models.college ||
  mongoose.model("college", collegeschema);