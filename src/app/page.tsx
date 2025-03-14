"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ib/store";
import Link from "next/link";
import { fetchMoviesHome } from "@/ib/homeSlice";
import { fetchMoviesSlider } from "@/ib/homeSlider";
import { AppDispatch } from "@/ib/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { addToWatchlist } from "@/ib/watchlistSlice";


export default function HomePage() {
  const { moviesSlider } = useSelector((state: RootState) => state.moviesSlider);
  const { moviesHome, loading } = useSelector((state: RootState) => state.moviesHome);
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchMoviesHome(searchTerm));
    } else {
      dispatch(fetchMoviesHome("action"));
    }
    dispatch(fetchMoviesSlider());
  }, [dispatch, searchTerm]);

  const handleAddToWatchlist = (movie: any) => {
    dispatch(addToWatchlist(movie));

    // ✅ تحديث localStorage بعد إضافة الفيلم
    const storedWatchlist = localStorage.getItem("watchlist");
    const watchlistMovies = storedWatchlist ? JSON.parse(storedWatchlist) : [];

    // ✅ تجنب التكرار
    const exists = watchlistMovies.some((m: any) => m.imdbID === movie.imdbID);
    if (!exists) {
      watchlistMovies.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlistMovies));
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const filteredMovies = moviesHome.filter((movieHome) =>
    movieHome.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 py-20 relative">
      {/* ✅ Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity animate-fadeIn">
          ✅ Added to Watchlist!
        </div>
      )}

      {/* 🔹 Slider Section */}
      <div className="mb-10 bg-gray-900 p-4 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">Trending Movies</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          className="max-w-4xl mx-auto"
        >
          {moviesSlider?.map((movie) => (
            <SwiperSlide key={movie.imdbID}>
              <div className="flex justify-center">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full max-w-2xl h-[400px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔍 شريط البحث */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full max-w-md p-3 rounded-lg text-black bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">🎬 Popular Movies</h1>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movieHome) => (
            <div key={movieHome.imdbID} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              <Link href={`/MovieDetails/${movieHome.imdbID}`}>
                <img
                  src={movieHome.Poster}
                  alt={movieHome.Title}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{movieHome.Title}</h2>
                <p className="text-gray-400">{movieHome.Year}</p>
                <div className="flex justify-between">
                  <button
                    className="bg-yellow-500 text-black px-3 py-2 rounded mt-2 w-full mx-1 hover:bg-yellow-600"
                    onClick={() =>
                      handleAddToWatchlist({
                        imdbID: movieHome.imdbID,
                        Title: movieHome.Title,
                        Year: movieHome.Year,
                        Poster: movieHome.Poster,
                      })
                    }
                  >
                    Add to Watchlist
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
