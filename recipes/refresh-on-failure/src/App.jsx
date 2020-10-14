import React from 'react';
import PropTypes from 'prop-types';

function App({ children }) {
  return <div>Hello {children}</div>;
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
