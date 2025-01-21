import { Request, Response, NextFunction } from 'express';
import ITokenService from '../../../interfaces/services/token-service';
import TokenService from '../../services/token-service';
import AuthenticationError from '../../../application/errors/authentication-error';
import ServiceProviderRepository from '../../database/repositories/service-provider-repository';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';

class ServiceProviderAuthMiddleware {
  public constructor(
    private _token: ITokenService = new TokenService(),
    private _serviceProviderRepository: IServiceProviderRepository = new ServiceProviderRepository(),
  ) {}

  public validate = async (request: Request, response: Response, next: NextFunction) => {
    if (request.headers.authorization === undefined) {
      throw new AuthenticationError('Authorization is required');
    }

    const { id } = this._token.validate(request.headers.authorization);

    const user = await this._serviceProviderRepository.findById(id);

    if (user === null) {
      throw new AuthenticationError('Invalid autorization');
    }

    request.body.user = user;

    next();
  };
}

export default ServiceProviderAuthMiddleware;