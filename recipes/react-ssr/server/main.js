const React = require('react');
const { renderToString } = require('react-dom/server');

const Root = require('../client/Root').default;

function render() {
  const markup = renderToString(<Root />);

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

module.exports = async (ctx, next) => {
  ctx.body = `${render()}`;
  await next();
};
