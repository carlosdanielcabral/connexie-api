import { Request, Response, NextFunction } from 'express';
import ITokenService from '../../../interfaces/services/token-service';
import TokenService from '../../services/token-service';
import AuthenticationError from '../../../application/errors/authentication-error';
import ICustomerRepository from '../../../interfaces/repositories/customer-repository';
import CustomerRepository from '../../database/repositories/customer-repository';

class CustomerAuthMiddleware {
  public constructor(
    private _token: ITokenService = new TokenService(),
    private _customerRepository: ICustomerRepository = new CustomerRepository(),
  ) {}

  public validate = async (request: Request, response: Response, next: NextFunction) => {
    if (request.headers.authorization === undefined) {
      throw new AuthenticationError('Authorization is required');
    }

    const { id } = this._token.validate(request.headers.authorization);

    const user = await this._customerRepository.findById(id);

    if (user === null) {
      throw new AuthenticationError('Invalid autorization');
    }

    request.body.user = user;

    next();
  };
}

export default CustomerAuthMiddleware;