'use client'; // 클라이언트 컴포넌트로 선언

import { Provider } from 'react-redux';
import store from './store';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
