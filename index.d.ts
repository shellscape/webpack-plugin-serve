import { Url } from 'url';
import {
  Config as HttpProxyMiddlewareConfig,
  Proxy
} from 'http-proxy-middleware';
import * as Koa from 'koa';
import {
  ServerOptions as Http2ServerOptions,
  SecureServerOptions as Http2SecureServerOptions
} from 'http2';
import { ServerOptions as HttpsServerOptions} from 'https';
import { ZlibOptions } from 'zlib';

declare module 'webpack-plugin-serve' {
  interface CompressOptions extends ZlibOptions {
    filter?: (content_type: string) => boolean;
    threshold?: number;
  }

  interface KoaStaticOptions {
    maxage?: number;
    hidden?: boolean;
    index?: string;
    defer?: boolean;
    gzip?: boolean;
    br?: boolean;
    setHeaders?: (res, path, stats) => any;
    extensions?: Array<string> | boolean;
  }

  type RewriteTo = (context: Context) => string;

  interface Context {
    match: RegExpMatchArray;
    parsedUrl: Url;
  }

  interface Rewrite {
    from: RegExp;
    to: string | RegExp | RewriteTo;
  }

  interface HistoryApiFallbackOptions {
    disableDotRule?: true;
    htmlAcceptHeaders?: string[];
    index?: string;
    logger?: typeof console.log;
    rewrites?: Rewrite[];
    verbose?: boolean;
  }

  interface Builtins {
    proxy: (args: HttpProxyMiddlewareConfig) => Proxy;
    compress: (opts: CompressOptions) => void;
    static: (opts: KoaStaticOptions) => void;
    historyFallback: (opts: HistoryApiFallbackOptions) => void;
    websocket: () => void;
    four0four: (fn?: (ctx: Koa.Context) => void) => void;
  }

  export interface WebpackPluginServeOptions {
    client?: {
      address: string;
    };
    compress?: boolean;
    historyFallback?: boolean | HistoryApiFallbackOptions;
    hmr?: boolean;
    host?: string | (() => Promise<string>) | (() => string);
    http2?: boolean | Http2ServerOptions | Http2SecureServerOptions;
    https?: HttpsServerOptions;
    liveReload?: boolean;
    log?: {
      level: string;
      timestamp?: boolean;
    };
    middleware?: (app: Koa, builtins: Builtins) => void;
    open?: boolean | {
      wait?: boolean;
      app?: string | ReadonlyArray<string>;
    };
    port?: number | (() => Promise<number>) | (() => number);
    progress?: boolean | 'minimal';
    static?: string | Array<string>;
    status?: boolean;
  }

  export class WebpackPluginServe {
    constructor(opts?: WebpackPluginServeOptions);
  }
}
