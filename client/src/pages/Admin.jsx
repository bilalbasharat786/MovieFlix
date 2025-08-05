import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tmdbId, setTmdbId] = useState("");
  const [doodLink, setDoodLink] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "Bilal@786";
  const API_BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    if (authenticated) fetchMovies();
  }, [authenticated]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies`);
      setMovies(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch movies");
    }
  };

  const handleAddMovie = async () => {
    if (!tmdbId || !doodLink) {
      alert("Please enter both TMDB ID and DoodStream Link");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/movies`, { tmdbId, doodStreamLink: doodLink });
      setTmdbId("");
      setDoodLink("");
      fetchMovies();
    } catch (err) {
      setError("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔑 Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "250px" }}
        />
        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) setAuthenticated(true);
            else alert("❌ Wrong Password!");
          }}
          style={{ padding: "10px 20px" }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎬 Add Movie</h2>
      <input
        type="text"
        placeholder="TMDB Movie ID"
        value={tmdbId}
        onChange={(e) => setTmdbId(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "10px", width: "300px" }}
      />
      <input
        type="text"
        placeholder="DoodStream Link"
        value={doodLink}
        onChange={(e) => setDoodLink(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "10px", width: "300px" }}
      />
      <button onClick={handleAddMovie} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Adding..." : "Add Movie"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <h3 style={{ marginTop: "30px" }}>📂 Uploaded Movies</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie._id} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
            <img
              src={movie.poster.startsWith("http")
                ? movie.poster
                : `https://image.tmdb.org/t/p/w200${movie.poster}`}
              alt={movie.title}
              width="50"
              style={{ marginRight: "10px", borderRadius: "5px" }}
            />
            <span>{movie.title} ({movie.releaseDate})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
