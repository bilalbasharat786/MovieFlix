import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  description: String,
  rating: Number,
  releaseDate: String,
  actors: [
    {
      name: String,
      image: String
    }
  ],
  doodStreamLink: String
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);

