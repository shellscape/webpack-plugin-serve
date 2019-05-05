const Joi = require('joi');
const isPromise = require('is-promise');

// until https://github.com/hapijs/joi/issues/1690 is fixed, we have to have a base of any(). once
// they get that fixed, we can use object() here, which is what we should be using
const joi = Joi.extend((base) => {
  return {
    base,
    language: {
      promise: 'must be a promise-like object'
    },
    name: 'any',
    rules: [
      {
        name: 'promise',
        validate(params, value, state, options) {
          if (!isPromise(value)) {
            return this.createError('any.promise', { v: value }, state, options);
          }

          return value;
        }
      }
    ]
  };
});

// until https://github.com/hapijs/joi/issues/1691 is fixed, we have to use `any().allow()`,
// `any().forbidden()` and `any().promise()`
const { any, array, boolean, func, number, object, string, validate } = joi.bind();

module.exports = {
  validate(options) {
    const keys = {
      allowMany: boolean(),
      // get it together, Prettier! https://github.com/prettier/prettier/issues/3621
      // prettier-ignore
      client: [object().keys({ address: string(), retry: boolean(), silent: boolean() }).allow(null)],
      compress: [boolean().allow(null)],
      headers: object().allow(null),
      historyFallback: [boolean(), object()],
      hmr: boolean(),
      // prettier-ignore
      host: [any().promise().allow(null), string()],
      http2: [boolean(), object()],
      https: object(),
      liveReload: boolean(),
      log: object().keys({ level: string(), timestamp: boolean() }),
      middleware: func(),
      open: [boolean(), object()],
      // prettier-ignore
      port: [number().integer().max(65535), any().promise()],
      progress: [boolean(), string().valid('minimal')],
      secure: any().forbidden(),
      // prettier-ignore
      static: [
        string().allow(null),
        array().items(string()),
        object().keys({ glob: array().items(string()), options: object() })
      ],
      status: boolean(),
      waitForBuild: boolean()
    };
    const schema = object().keys(keys);
    const results = validate(options, schema);

    return results;
  }
};
