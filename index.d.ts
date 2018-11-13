import { Url } from 'url';
import * as HttpProxyMiddleware from 'http-proxy-middleware';
import * as Koa from 'koa';
import * as Http2 from 'http2';
import * as Https from 'https';

type RewriteTo = (context: Context) => string;

interface Context {
    match: RegExpMatchArray;
    parsedUrl: Url;
}

interface Rewrite {
    from: RegExp;
    to: string | RegExp | RewriteTo;
}

interface HistoryApiFallback {
    disableDotRule?: true;
    htmlAcceptHeaders?: string[];
    index?: string;
    logger?: typeof console.log;
    rewrites?: Rewrite[];
    verbose?: boolean;
}

interface Builtins {
    proxy: (args: HttpProxyMiddleware.Config) => void;
}

export interface WebpackPluginServeOptions {
    client?: {
        address: string;
    };
    compress?: boolean;
    historyFallback?: boolean | HistoryApiFallback;
    hmr?: boolean;
    host?: string | (() => string);
    http2?: boolean | Http2.ServerOptions | Http2.SecureServerOptions;
    https?: Https.ServerOptions;
    liveReload?: boolean;
    log?: { 
        level: string;
        timestamp?: boolean;
    };
    middleware?: (app: Koa, builtins: Builtins) => void;
    open?: boolean | {};
    port?: number | (() => number);
    progress?: boolean | 'minimal';
    static?: string | Array<string>;
    status?: boolean;
}

export declare class WebpackPluginServe {
    constructor(opts?: WebpackPluginServeOptions);
}