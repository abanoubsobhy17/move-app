// homeSlider.ts
"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "f5791838"; // استبدل بمفتاح API الخاص بك

// جلب أفلام السلايدر
export const fetchMoviesSlider = createAsyncThunk(
  "moviesSlider/fetchMovies",
  async () => {
    const response = await fetch(`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`);
    const data = await response.json();
    return data.Search || [];
  }
);

const sliderSlice = createSlice({
  name: "moviesSlider",
  initialState: { moviesSlider: [], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesSlider.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesSlider = action.payload;
      })
      .addCase(fetchMoviesSlider.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch slider movies";
      });
  },
});

export const sliderReducer = sliderSlice.reducer;
