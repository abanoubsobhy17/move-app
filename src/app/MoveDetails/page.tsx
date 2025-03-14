"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = "f5791838";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{movie.Title}</h1>
        <img src={movie.Poster} alt={movie.Title} className="w-full h-96 object-cover mb-4" />
        <p className="text-lg">{movie.Plot}</p>
        <p className="text-gray-400 mt-2">Year: {movie.Year}</p>
        <p className="text-gray-400">Genre: {movie.Genre}</p>
        <p className="text-gray-400">IMDB Rating: {movie.imdbRating}</p>
      </div>
    </div>
  );
}
