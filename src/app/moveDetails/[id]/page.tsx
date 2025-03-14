"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { addToWatchlist } from "@/ib/watchlistSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/ib/store";
import Image from "next/image"; // 🔹 استيراد Image من next/image

const TMDB_API_KEY = "23f3fdd105596ab21d5e2338a34a7029";

interface Movie {
  imdb_id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  vote_average: number;
}

interface MovieImage {
  file_path: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export default function MoveDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
        .then((res) => res.json())
        .then((data: Movie) => {
          setMovie(data);
          setLoading(false);
        });

      fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_API_KEY}`)
        .then((res) => res.json())
        .then((data: { backdrops: MovieImage[] }) => {
          const backdrops = data.backdrops.map((img) => `https://image.tmdb.org/t/p/original${img.file_path}`);
          setImages(backdrops);
        });

      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`)
        .then((res) => res.json())
        .then((data: { cast: CastMember[] }) => {
          setCast(data.cast);
        });
    }
  }, [id]);

  const handleAddToWatchlist = () => {
    if (!movie) return;
    dispatch(
      addToWatchlist({
        imdbID: movie.imdb_id,
        Title: movie.title,
        Year: movie.release_date.split("-")[0],
        Poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      })
    );

    const storedWatchlist = localStorage.getItem("watchlist");
    const watchlistMovies = storedWatchlist ? JSON.parse(storedWatchlist) : [];

    const exists = watchlistMovies.some((m: Movie) => m.imdb_id === movie.imdb_id);
    if (!exists) {
      watchlistMovies.push({
        imdbID: movie.imdb_id,
        Title: movie.title,
        Year: movie.release_date.split("-")[0],
        Poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      });
      localStorage.setItem("watchlist", JSON.stringify(watchlistMovies));
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showToast && (
        <div className="fixed bottom-10 left-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity animate-fadeIn">
          ✅ Added to Watchlist!
        </div>
      )}

      <Swiper modules={[Autoplay, Pagination]} spaceBetween={0} slidesPerView={1} autoplay={{ delay: 3000, disableOnInteraction: false }} loop pagination={{ clickable: true }} className="w-full h-[70vh]">
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`${movie?.title} - Scene ${index + 1}`}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-7xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg -mt-20 relative z-10">
        <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
        <p className="text-lg">{movie?.overview}</p>
        <p className="text-gray-400 mt-2">Year: {movie?.release_date.split("-")[0]}</p>
        <p className="text-gray-400">Genre: {movie?.genres.map((genre) => genre.name).join(", ")}</p>
        <p className="text-gray-400">Rating: {movie?.vote_average}</p>

        <button onClick={handleAddToWatchlist} className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
          Add to Watchlist
        </button>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-2 text-gray-300">{actor.name}</p>
                <p className="text-gray-400 text-sm">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}