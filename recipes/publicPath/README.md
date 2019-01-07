## Public Path and Custom Index

The goal of this recipe:

- Have webpack configs in a dedicated top-level `/webpack` directory
- Have source code in `/html/js/`
- Use a custom `index.html` file for serving content which exists in `/html/index.html`
- Export webpack bundles into `/html/build`
- Serve main bundle from `/html/build/bundle.js`

What doesn't work right now:

- A new `index.html` is written into `html/build`, instead of a using the existing `/html/index.html`.
