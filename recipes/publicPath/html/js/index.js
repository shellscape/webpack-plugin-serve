import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const render = () => {
  const root = document.getElementById('App');
  document.body.appendChild(root);

  ReactDOM.render(<App />, root);
};

render();
