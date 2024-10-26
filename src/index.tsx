/** @format */

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/bundle';
import './common/i18n/index';
import './common/ui/assets/index.scss';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Routers from './routers';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';
import { ReactToastifyProvider } from './app/contexts/ReactToastifyProvider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <ReactToastifyProvider>
    <Provider store={store}>
      <Routers />
    </Provider>
  </ReactToastifyProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
