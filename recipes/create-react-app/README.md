## 🍲 Create-React-App App

Since it was built to hide configuration from developers, `create-react-app`
actually makes it harder to use great plugins like this one.

### ☠️ Warning ☠️

This recipe is definitely neither vegan nor gluten-free. It can neither be
confirmed nor denied whether it contains traces of lead or arsenic. Develop at
your own risk.

This recipe may have broken features that the author doesn't use.

If you're working on a new project, *it is strongly advised* that you consider
one of the following alternatives:
* Neutrinojs [9.0 beta release candidate](https://github.com/neutrinojs/neutrino/issues/1129)
* Finding/creating a project template and using [degit](https://github.com/Rich-Harris/degit)
* A custom webpack config

🚨You have been warned. 🚨

## Recipe

With that out of the way, let's use `webpack-plugin-serve` with
`create-react-app`.

Note that this entire section has already been taken care of, and the artifacts
now live within this codebase. However, in order for you to effectively
replicate what has been created here, it will help to write down these steps.

You'll need to create a new app using the latest version of `create-react-app`:

```bash
create-react-app my-app
cd my-app

# Install the rewiring plugins
npm install -D react-app-rewired react-app-rewire-unplug

# This should already be installed by create-react-app, but it's helpful to
# keep track of this installation in package.json
npm install -D mini-css-extract-plugin

# Add webpack-plugin-serve specific packages
npm install -D webpack-nano webpack-plugin-serve

# Install react-hot-loader dependencies
npm install -D @hot-loader/react-dom
npm install react-hot-loader
```

Under the hood, `create-react-app` uses the package `react-scripts` to do most
of the heavy lifting. We'll be overriding its
[configuration files](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config)
using [react-app-rewired](https://github.com/timarney/react-app-rewired).
Note that these configurations change between versions of
`react-scripts`, so any upgrade of it may cause these configuration
overrides to break.

Also update your scripts within `package.json`:

```diff
  /* package.json */
  "scripts": {
-   "start": "react-scripts start",
+   "start": "wp --config webpack.config.js",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

### Rewiring

We've included two additional files within this recipe:
* `config-overrides.js`, which defines how we're overriding the `react-scripts` webpack config
* `webpack.config.js`, which just reads the overridden config for third party
  tools (namely, [wepack-nano](https://github.com/shellscape/webpack-nano)).

The end solution will change nothing for production. Also note that the new
`start` command is custom. See `package.json` `scripts` for more info.

Run `npm start` to see it in action. Edit a `.css` file or a `.js` file within
`src/` and you should see the application update in place.

Note that none of the pre-defined `create-react-app` files have been changed,
aside from `src/App.js` which now implements hot module replacement via
`react-hot-loader`.
