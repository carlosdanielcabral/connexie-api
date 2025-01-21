import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import HttpStatusCode from '../status-code';
import ValidationError from '../../../application/errors/validation-error';
import ExternalServiceError from '../../../application/errors/external-service-error';
import AuthenticationError from '../../../application/errors/authentication-error';
import NotFoundError from '../../../application/errors/not-found-error';

export interface ErrorHandler extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorMiddleware = (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof JsonWebTokenError || err instanceof AuthenticationError)
    return res.status(HttpStatusCode.Unauthorized).json({ message: err.message });

  if (err instanceof ZodError)
    return res.status(HttpStatusCode.BadRequest).json({ message: err.message });

  if (err instanceof ValidationError)
    return res.status(HttpStatusCode.BadRequest).json({ message: err.message });

  if (err instanceof NotFoundError)
    return res.status(HttpStatusCode.NotFound).json({ message: err.message });

  console.error(err);

  if (err instanceof ExternalServiceError)
    return res.status(HttpStatusCode.BadGateway).json({ message: err.message });    

  return res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal Server Error' });
};

export default ErrorMiddleware;