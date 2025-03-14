"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "f5791838";

// ✅ جلب أفلام الصفحة الرئيسية
export const fetchMoviesHome = createAsyncThunk(
  "moviesHome/fetchMovies",
  async (searchTerm: string) => {
    const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
    const data = await response.json();
    return data.Search || [];
  }
);

const homeSlice = createSlice({
  name: "moviesHome",
  initialState: { moviesHome: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesHome.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesHome.fulfilled, (state, action) => {
        state.loading = false;
        state.moviesHome = action.payload;
      })
      .addCase(fetchMoviesHome.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch home movies";
      });
  },
});

// ✅ تأكد إن الـ reducer متصدّر هنا
export const movieHomeReducer = homeSlice.reducer;
