const app = {
  root: require('./component'),
  render() {
    return this.root;
  }
};

function render() {
  const markup = app.render();

  return `
    <!doctype>
    <html>
      <head>
        <title>fixture: ssr</title>
      </head>
      <body>
        <main>${markup}</main>
        <script src="/output/output.js"></script>
      </body>
    </html>
  `;
}

if (module.hot) {
  module.hot.accept(['./component'], () => {
    app.root = require('./component');
  });
}

module.exports = async (ctx, next) => {
  ctx.body = `${render()}`;
  await next();
};
