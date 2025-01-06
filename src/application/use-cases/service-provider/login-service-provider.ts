import ServiceProvider from "../../../domain/entities/service-provider";
import IServiceProviderRepository from "../../../interfaces/repositories/service-provider-repository";
import HashService from "../../../interfaces/services/hash-service";
import ValidationError from "../../errors/validation-error";

class LoginServiceProvider {
  constructor(
    private readonly _serviceProviderRepository: IServiceProviderRepository,
    private readonly _hashService: HashService,
) {}

  public execute = async (email: string, password: string): Promise<ServiceProvider> => {
    const serviceProvider = await this._serviceProviderRepository.findByEmail(email);

    if (!serviceProvider) throw new ValidationError('Invalid email or password');

    const isSamePassword = this._hashService.compare(password, serviceProvider.password);

    if (!isSamePassword) throw new ValidationError('Invalid email or password');

    return serviceProvider;
  }
}

export default LoginServiceProvider;