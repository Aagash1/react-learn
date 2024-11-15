import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";

const MovieDetails = lazy(() => import("./MovieDetails"));

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies from the API
  useEffect(() => {
    if (query) {
      fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`)
        .then((response) => response.json())
        .then((data) => setMovies(data))
        .catch((error) => console.error("Error fetching movies:", error));
    }
  }, [query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="App">
      <h1>Movie Search App</h1>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />
      <div className="movie-list">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-item"
            onClick={() => setSelectedMovie(movie)}
          >
            {movie.title}
          </div>
        ))}
      </div>

      {selectedMovie && (
        <Suspense fallback={<div>Loading details...</div>}>
          <MovieDetails movie={selectedMovie} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
