"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addToWatchlist } from "@/ib/watchlistSlice";

const tmdbApiKey = "23f3fdd105596ab21d5e2338a34a7029";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface Category {
  name: string;
  id: number;
}

const categories: Category[] = [
  { name: "Action", id: 28 },
  { name: "Comedy", id: 35 },
  { name: "Drama", id: 18 },
  { name: "Horror", id: 27 },
  { name: "Romance", id: 10749 },
  { name: "Animation", id: 16 },
];

export default function MoviesPage() {
  const [moviesByCategory, setMoviesByCategory] = useState<{ [key: number]: Movie[] }>({});
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const fetchedMovies: { [key: number]: Movie[] } = {};
        for (const category of categories) {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${category.id}`
          );
          const data = await res.json();
          fetchedMovies[category.id] = data.results || [];
        }
        setMoviesByCategory(fetchedMovies);

        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}`
        );
        const trendingData = await trendingRes.json();
        setTrendingMovies(trendingData.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const addMovieToWatchlist = (movie: Movie) => {
    dispatch(
      addToWatchlist({
        imdbID: movie.id.toString(),
        Title: movie.title,
        Year: movie.release_date.split("-")[0],
        Poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      })
    );
    toast.success(`${movie.title} added to Watchlist!`, { position: "bottom-left" });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: true,
    centerPadding: "20px",
  };

  if (loading) {
    return <p className="text-center text-gray-400 text-lg font-semibold">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-200">Movies by Category</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/5 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`block w-full text-left px-4 py-2 my-1 rounded ${
                selectedCategory === category.id ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="w-full md:w-4/5 p-4">
          <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
          <Slider {...sliderSettings}>
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="p-2 text-center">
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  width={250}
                  height={400}
                  className="rounded-lg mx-auto shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        {categories.find((c) => c.id === selectedCategory)?.name} Movies
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {moviesByCategory[selectedCategory]?.map((movie) => (
          <div key={movie.id} className="p-2 text-center">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              width={250}
              height={400}
              className="rounded-lg mx-auto shadow-lg"
            />
            <button
              onClick={() => addMovieToWatchlist(movie)}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            >
              Add to Watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}