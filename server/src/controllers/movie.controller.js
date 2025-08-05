import axios from "axios";
import Movie from "../models/movie.model.js";

export const addMovie = async (req, res) => {
  try {
    const { tmdbId, doodStreamLink } = req.body;
    console.log("📩 Incoming Movie Request:", { tmdbId, doodStreamLink });

    // ✅ Check if API Key is loaded
    if (!process.env.TMDB_KEY) {
      console.error("❌ TMDB API Key missing in .env file");
      return res.status(500).json({ error: "Server misconfiguration: Missing API key" });
    }

    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_KEY}&append_to_response=credits`;
    console.log("🌍 TMDB API URL:", url);

    const tmdbResponse = await axios.get(url);
    console.log("✅ TMDB Data Fetched:", tmdbResponse.data.title);

    // ✅ Safe check for credits
    const cast = tmdbResponse.data.credits?.cast || [];

    const movieData = {
      title: tmdbResponse.data.title,
      poster: `https://image.tmdb.org/t/p/w500${tmdbResponse.data.poster_path}`,
      description: tmdbResponse.data.overview,
      rating: tmdbResponse.data.vote_average,
      releaseDate: tmdbResponse.data.release_date,
      actors: cast.slice(0, 5).map(c => ({
        name: c.name,
        image: c.profile_path
          ? `https://image.tmdb.org/t/p/w500${c.profile_path}`
          : null
      })),
      doodStreamLink
    };

    console.log("📝 Prepared Movie Data:", movieData);

    const newMovie = await Movie.create(movieData);
    console.log("✅ Movie Saved in DB:", newMovie._id);

    res.json(newMovie);
  } catch (err) {
    console.error("❌ Add Movie Error:", err.message, err.response?.data || "");
    res.status(500).json({ error: "Failed to add movie" });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log("📂 Movies Fetched:", movies.length);
    res.json(movies);
  } catch (err) {
    console.error("❌ Fetch Movies Error:", err.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};
