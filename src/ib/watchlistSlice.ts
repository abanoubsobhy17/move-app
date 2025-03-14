"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface WatchlistState {
  movies: Movie[];
}

// ✅ تحميل البيانات من Local Storage عند بداية التشغيل
const loadWatchlist = (): Movie[] => {
  if (typeof window !== "undefined") {
    const storedWatchlist = localStorage.getItem("watchlist");
    return storedWatchlist ? JSON.parse(storedWatchlist) : [];
  }
  return [];
};

const initialState: WatchlistState = {
  movies: loadWatchlist(),
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<Movie>) => {
      const exists = state.movies.some((movie) => movie.imdbID === action.payload.imdbID);
      if (!exists) {
        state.movies.push(action.payload);
        localStorage.setItem("watchlist", JSON.stringify(state.movies)); // ✅ حفظ البيانات
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter((movie) => movie.imdbID !== action.payload);
      localStorage.setItem("watchlist", JSON.stringify(state.movies)); // ✅ تحديث البيانات
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export const watchlistReducer = watchlistSlice.reducer;
