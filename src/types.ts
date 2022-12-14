import { Request } from 'express'

/*
  REQUESTS
*/
export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
