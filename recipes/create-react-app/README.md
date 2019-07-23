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

You'll need to create a new app using the latest version of `create-react-app`:

```bash
create-react-app my-app
cd my-app
npm install -D \
  webpack-plugin-serve \
  webpack-nano \
  react-app-rewired \
  react-app-rewire-unplug \
  @hot-loader/react-dom
npm install react-hot-loader
```

Under the hood, `create-react-app` uses the package `react-scripts` to do most
of the heavy lifting. We'll be overriding its configuration files. Note that
these configurations change between versions of `react-scripts`, so any upgrade
of that package may cause these configuration overrides to break.


### Rewiring

We've included within this recipe a `config-overrides.js` file along with a
`webpack.config.js` file that just reads the overridden config for third party
tools.

The end solution will change nothing for production. Also note that the new
`start` command is custom. See `package.json` `scripts` for more info. Run
`npm start` to see it in action.
