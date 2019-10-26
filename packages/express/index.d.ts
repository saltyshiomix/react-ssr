import express from 'express';

declare function reactSsrExpress(): express.Express;

declare namespace reactSsrExpress {
  var json: typeof express.json;
  var raw: typeof express.raw;
  var text: typeof express.text;
  var application: Application;
  var request: Request;
  var response: Response;
  var static: typeof express.static;
  var urlencoded: typeof express.urlencoded;
  export function Router(options?: RouterOptions): express.Router;
  interface RouterOptions {
      caseSensitive?: boolean;
      mergeParams?: boolean;
      strict?: boolean;
  }
  interface Application extends express.Application { }
  interface CookieOptions extends express.CookieOptions { }
  interface Errback extends express.Errback { }
  interface ErrorRequestHandler extends express.ErrorRequestHandler { }
  interface Express extends express.Express { }
  interface Handler extends express.Handler { }
  interface IRoute extends express.IRoute { }
  interface IRouter<T> extends express.IRouter<T> { }
  interface IRouterHandler<T> extends express.IRouterHandler<T> { }
  interface IRouterMatcher<T> extends express.IRouterMatcher<T> { }
  interface MediaType extends express.MediaType { }
  interface NextFunction extends express.NextFunction { }
  interface Request extends express.Request { }
  interface RequestHandler extends express.RequestHandler { }
  interface RequestParamHandler extends express.RequestParamHandler { }
  export interface Response extends express.Response { }
  interface Router extends express.Router { }
  interface Send extends express.Send { }
}

export = reactSsrExpress;
