import 'reflect-metadata';
import React from 'react';

import App from './App';
import ReactDOM from 'react-dom'; // Import ReactDOM for the legacy render API

/* TODO - Remove legacy render API and use createRoot instead when google maps is fixed issue https://github.com/google-map-react/google-map-react/issues/1223
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
*/
const container = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  container,
);
