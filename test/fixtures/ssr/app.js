import component from './component';

const main = document.querySelector('main');

function render(markup) {
  main.innerHTML = markup;
}

render(component);

if (module.hot) {
  module.hot.accept('./component', () => {
    const nextComponent = require('./component');
    render(nextComponent);
  });
}
