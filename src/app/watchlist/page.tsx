"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ib/store";
import { removeFromWatchlist } from "@/ib/watchlistSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { movies } = useSelector((state: RootState) => state.watchlist);
  const [watchlist, setWatchlist] = useState<Movie[]>(movies);

  useEffect(() => {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  useEffect(() => {
    setWatchlist(movies);
  }, [movies]);

  const handleRemove = (imdbID: string) => {
    dispatch(removeFromWatchlist(imdbID));
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-500 text-center">No movies in your watchlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={movie.Poster}
                alt={movie.Title}
                width={200}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {movie.Title} <span className="text-gray-400">({movie.Year})</span>
                </h2>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleRemove(movie.imdbID)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center text-sm"
                  >
                    <span>Remove</span>
                  </button>
                  <button
                    onClick={() => router.push(`/watch/${movie.imdbID}`)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center text-sm"
                  >
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
