import ServiceProvider from "../../../domain/entities/service-provider";
import IServiceProviderRepository from "../../../interfaces/repositories/service-provider-repository";

class ListServiceProvider {
  constructor(
    private readonly _serviceProviderRepository: IServiceProviderRepository,
) {}

  public execute = async (): Promise<ServiceProvider[]> => {
    const serviceProviders = await this._serviceProviderRepository.list();

    return serviceProviders;
  }
}

export default ListServiceProvider;