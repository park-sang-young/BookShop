import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import bookReducer from './bookSlice'; // 기존의 책 상태 관리 (선택된 책)

const store = configureStore({
  reducer: {
    cart: cartReducer,
    book: bookReducer, // 이미 존재하는 book slice
  },
});

export default store;
