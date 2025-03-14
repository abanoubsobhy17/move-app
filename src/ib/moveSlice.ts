"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "f5791838"; // 🔴 استبدلها بمفتاح API الحقيقي

// ✅ جلب الأفلام من OMDb API
export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const response = await fetch(`https://www.omdbapi.com/?s=spider&apikey=${API_KEY}`);
  const data = await response.json();
  console.log(data);
  
  return data.Search || []; // 🔹 إرجاع الأفلام فقط
});

const movieSlice = createSlice({
  name: "movies",
  initialState: { movies: [], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch movies";
      });
  },
});

export const movieReducer = movieSlice.reducer;
