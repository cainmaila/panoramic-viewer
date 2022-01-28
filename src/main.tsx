import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import { CssBaseline } from '@mui/material';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline enableColorScheme />
    <Home />
  </React.StrictMode>,
  document.getElementById('root'),
);
