## 🍲 refresh-on-failure

In this recipe, you'll see how to leverage `refresh-on-failure` option to force a refresh when HMR fails. The example uses React. To see it in action, install the dependencies first and run the example (`npm start`). When it's running, try altering the React component (`App.jsx`) first to see regular HMR. If `another.js` is modified, it will revert to refresh behavior as the module isn't being hot replaced.

This recipe leverages [webpack-nano](https://github.com/shellscape/webpack-nano), a very tiny, very clean webpack CLI.
