import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import CainSDK from './sdk/main';

const sdk = new CainSDK();
sdk.log();

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root'),
);
