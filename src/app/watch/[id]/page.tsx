"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const omdbApiKey = "f5791838";
const tmdbApiKey = "23f3fdd105596ab21d5e2338a34a7029";

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MovieImage {
  file_path: string;
}

export default function WatchMoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [images, setImages] = useState<MovieImage[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${omdbApiKey}`);
        const data = await res.json();

        if (data.Response === "True") {
          setMovie(data);
          fetchMovieTrailer(data.imdbID);
          fetchMovieCast(data.imdbID);
          fetchMovieImages(data.imdbID);
        }
      } catch (error) {
        console.error("Error fetching movie data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const fetchMovieCast = async (imdbID: string) => {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/movie/${imdbID}/credits?api_key=${tmdbApiKey}`
      );
      const tmdbData = await tmdbRes.json();
      setCast(tmdbData.cast);
    } catch (error) {
      console.error("Error fetching cast", error);
    }
  };

  const fetchMovieImages = async (imdbID: string) => {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/movie/${imdbID}/images?api_key=${tmdbApiKey}`
      );
      const tmdbData = await tmdbRes.json();
      setImages(tmdbData.backdrops);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  const fetchMovieTrailer = async (imdbID: string) => {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/find/${imdbID}?api_key=${tmdbApiKey}&external_source=imdb_id`
      );
      const tmdbData = await tmdbRes.json();
      const tmdbMovieId = tmdbData.movie_results[0]?.id;

      if (!tmdbMovieId) return;

      const videosRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?api_key=${tmdbApiKey}`
      );
      const videosData = await videosRes.json();

      const trailer = videosData.results.find((vid: { type: string }) => vid.type === "Trailer");

      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
      }
    } catch (error) {
      console.error("Error fetching trailer", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg font-semibold">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-4">{movie?.Title} ({movie?.Year})</h1>
      <Slider className="mb-6">
        {images.map((img, index) => (
          <Image
            key={index}
            src={`https://image.tmdb.org/t/p/original${img.file_path}`}
            alt="Movie Scene"
            width={800}
            height={450}
            className="rounded-lg mx-auto"
          />
        ))}
      </Slider>
      {trailerUrl ? (
        <div className="flex justify-center mb-8">
          <iframe
            width="800"
            height="450"
            src={trailerUrl}
            title="Movie Trailer"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      ) : (
        <p className="text-center text-red-500">No trailer available</p>
      )}
      <h2 className="text-xl font-semibold mt-8 mb-4">Cast & Crew</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.map((actor) => (
          <div key={actor.id} className="text-center">
            <Image
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
              width={120}
              height={160}
              className="rounded-lg mx-auto mb-2"
            />
            <p className="text-sm font-medium text-white bg-gray-800 p-1 rounded-lg">{actor.name}</p>
            <p className="text-xs text-gray-400">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}