"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ib/store";
import { fetchMoviesHome } from "@/ib/homeSlice";
import { AppDispatch } from "@/ib/store";
import { fetchMoviesSlider } from "@/ib/homeSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

export default function ContactsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { moviesHome, loading } = useSelector((state: RootState) => state.moviesHome);
  const { moviesSlider } = useSelector((state: RootState) => state.moviesSlider);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchMoviesHome("action"));
    dispatch(fetchMoviesSlider());
  }, [dispatch]);

  const filteredMovies = moviesHome.filter((movie) =>
    movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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

      {/* 🎥 سلايدر الأفلام */}
      <div className="mb-10 bg-white p-4 rounded-full">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Trending Movies</h2>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          loop={true}
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

      {/* 📌 عرض الأفلام */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link key={movie.imdbID} href={`/contacts/${movie.imdbID}`}>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{movie.Title}</h2>
                  <p className="text-gray-400">{movie.Year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
