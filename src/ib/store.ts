"use client";
import { configureStore } from "@reduxjs/toolkit";
import { movieReducer } from "./moveSlice";
import { movieHomeReducer } from "./homeSlice";
import { sliderReducer } from "./homeSlider";
import { watchlistReducer } from "./watchlistSlice";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    moviesHome: movieHomeReducer,
    moviesSlider: sliderReducer,
    watchlist: watchlistReducer, // ✅ إضافة Reducer الـ Watchlist
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

