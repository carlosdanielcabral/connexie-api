import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import HttpStatusCode from '../status-code';

export interface ErrorHandler extends Error {
  status?: number;
}

const ErrorMiddleware = (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof JsonWebTokenError)
    return res.status(HttpStatusCode.Unauthorized).json({ message: err.message });

  if (err instanceof ZodError)
    return res.status(HttpStatusCode.BadRequest).json({ message: err.message });

//  if (err instanceof HttpError)
 //   return res.status(err.status).json({ message: err.message });

  console.error(err);

  return res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal Server Error' });
};

export default ErrorMiddleware;