const React = require('react');
const { renderToString } = require('react-dom/server');

const app = {
  root: require('../client/Root').default,
  render() {
    const Root = this.root;
    return renderToString(<Root />);
  }
};

function render() {
  const markup = app.render();

  return `
    <!doctype html>
    <html lang="en">
      <body>
        <div id="react">${markup}</div>
        <script src="client.js"></script>
      </body>
    </html>
  `;
}

if (module.hot) {
  module.hot.accept(['../client/Root'], () => {
    app.root = require('../client/Root').default;
  });
}

module.exports = async (ctx, next) => {
  ctx.body = `${render()}`;
  await next();
};
