const Joi = require('joi');

const joi = new Proxy(Joi, {
  get(o, name) {
    return o[name].bind(o);
  }
});
const { allow, array, boolean, forbidden, func, number, object, string, validate } = joi;

module.exports = {
  validate(options) {
    const keys = {
      client: [allow(null), object().keys({ address: string() })],
      compress: [allow(null), boolean()],
      historyFallback: [boolean(), object()],
      hmr: boolean(),
      host: [string(), func()],
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
        func()
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
