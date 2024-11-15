import React from "react";

const MovieDetails = ({ movie }) => {
  return (
    <div className="movie-details">
      <h2>Details for: {movie.title}</h2>
      <p>{movie.body}</p>
    </div>
  );
};

export default MovieDetails;
