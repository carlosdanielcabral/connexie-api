import IServiceProviderRepository from "../../../interfaces/repositories/service-provider-repository";

class CountServiceProvider {
  constructor(
    private readonly _serviceProviderRepository: IServiceProviderRepository,
) {}

  public execute = async (): Promise<Number> => {
    const serviceProviders = await this._serviceProviderRepository.count();

    return serviceProviders;
  }
}

export default CountServiceProvider;