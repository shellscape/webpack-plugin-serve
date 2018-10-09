[tests]: 	https://img.shields.io/circleci/project/github/shellscape/postcss-less.svg
[tests-url]: https://circleci.com/gh/shellscape/postcss-less

[cover]: https://codecov.io/gh/shellscape/postcss-less/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/postcss-less

[size]: https://packagephobia.now.sh/badge?p=postcss-less
[size-url]: https://packagephobia.now.sh/result?p=postcss-less

[loglevel]: https://githhub.com/pimterry/loglevel
[loglevelpre]: https://github.com/kutuluk/loglevel-plugin-prefix
[methodFactory]: lib/MethodFactory.js
[prefixFactory]: factory/PrefixFactory.js

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# webpack-plugin-serve

A Webpack development server in a plugin.

_Note: This module requires **Node v10.11.0+**._

## Install

Using npm:

```console
npm install webpack-plugin-serve --save-dev
```

Using yarn:

```console
yarn add webpack-plugin-serve --dev
```

## Usage

```console
npx webpack --config test/fixtures/simple/webpack.config.js
```

## Options

https
https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

http2
true
or https://nodejs.org/api/http2.html#http2_http2_createserver_options_onrequesthandler
or https://nodejs.org/api/http2.html#http2_http2_createsecureserver_options_onrequesthandler


## Meta

[CONTRIBUTING](./.github/CONTRIBUTING)

[LICENSE (Mozilla Public License)](./LICENSE)
