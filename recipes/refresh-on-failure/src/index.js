import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';
import name from './another';

render(<App>{name}</App>, document.getElementById('app'));
