import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

const elem = document.getElementById('react');

ReactDOM.hydrate(<Root />, elem);

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default;
    ReactDOM.hydrate(<NextRoot />, elem);
  });
}
