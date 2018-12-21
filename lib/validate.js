const Joi = require('joi');
const isPromise = require('is-promise');

const extendedJoi = Joi.extend((joi) => {
  return {
    base: joi,
    language: {
      promise: 'must be a promise-like object'
    },
    name: 'promise',
    rules: [
      {
        name: 'promise',
        validate(params, value, state, options) {
          if (!isPromise(value)) {
            return this.createError('promise', { value }, state, options);
          }

          return value;
        }
      }
    ]
  };
});

const joi = new Proxy(extendedJoi, {
  get(o, name) {
    return o[name].bind(o);
  }
});
const { allow, array, boolean, forbidden, func, number, object, promise, string, validate } = joi;

module.exports = {
  validate(options) {
    const keys = {
      client: [allow(null), object().keys({ address: string() })],
      compress: [allow(null), boolean()],
      historyFallback: [boolean(), object()],
      hmr: boolean(),
      host: [string(), promise()],
      http2: [boolean(), object()],
      https: object(),
      liveReload: boolean(),
      log: object().keys({ level: string(), timestamp: boolean() }),
      middleware: func(),
      open: [boolean(), object()],
      port: [
        number()
          .integer()
          .max(65535),
        promise()
      ],
      progress: [boolean(), string().valid('minimal')],
      secure: forbidden(),
      static: [allow(null), string(), array().items(string())],
      status: boolean()
    };
    const schema = object().keys(keys);

    const results = validate(options, schema);

    return results;
  }
};
