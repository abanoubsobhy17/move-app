"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ib/store";
import { removeFromWatchlist } from "@/ib/watchlistSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ استيراد useRouter للتنقل بين الصفحات

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ استخدام useRouter للتنقل

  const { movies } = useSelector((state: RootState) => state.watchlist);
  const [watchlist, setWatchlist] = useState(movies);

  // ✅ تحميل البيانات من Local Storage عند بداية التشغيل
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
              <img
                src={movie.Poster}
                alt={movie.Title}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => router.push(`/watch/${movie.imdbID}`)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center text-sm"
                  >
                    <span>WatchNow</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
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
