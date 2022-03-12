import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import axios from 'axios';

import { worker } from './mocks/browser';
if (process.env.NODE_ENV === 'development') {
  worker.start();
}

axios.get('/api').then((response) => {
  console.log(response.data);
});

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root'),
);
