import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import MovieSearch from "./MovieSearch";
const MovieDetails = lazy(() => import("./MovieDetails"));

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ count, setCount]=useState(1);
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const fetchMovies = async (query) => {
    if (query.trim() === "") {
      setMovies([]);
      return;
    }
    setCount(count+1);
    setLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const debouncedFetchMovies=debounce(fetchMovies,2000);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchMovies(value);
  };

  return (
    <div className="App">
      <MovieSearch />
      {count}
      <h1>Movie Search App with Debouncing</h1>
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />
      {loading && <div>Loading...</div>}
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
