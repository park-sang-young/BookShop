import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
  name: 'book',
  initialState: {
    searchResults: [],
    selectedBook: null,
    cartItems: [],
    error: null,
  },
  reducers: {
    setSearchResults(state, action) {
      state.searchResults = action.payload;
    },
    setSelectedBook(state, action) {
      state.selectedBook = action.payload;
    },
  },
});

export const { setSearchResults, setSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
