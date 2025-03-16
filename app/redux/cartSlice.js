import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [], // 장바구니 상태
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const book = action.payload;
      // 카트에 이미 책이 있는지 확인
      const existingBook = state.cart.find((item) => item.id === book.id);

      if (existingBook) {
        // 책이 이미 존재하면 수량을 증가
        existingBook.quantity += book.quantity;
      } else {
        // 책이 없으면 새로운 책 추가
        state.cart.push({ ...book, quantity: book.quantity || 1 });
      }
    },
    removeFromCart: (state, action) => {
      // 카트에서 책 삭제
      state.cart = state.cart.filter(book => book.id !== action.payload.id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const book = state.cart.find(book => book.id === id);
      
      if (book) {
        book.quantity = quantity; // 수량 업데이트
      }
    },
    clearCart: (state) => {
      // 장바구니 초기화
      state.cart = [];
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
