import ServiceProvider from "../../../domain/entities/service-provider";
import IServiceProviderRepository, { ListServiceProviderFilter } from "../../../interfaces/repositories/service-provider-repository";

class ListServiceProvider {
  constructor(
    private readonly _serviceProviderRepository: IServiceProviderRepository,
) {}

  public execute = async (filter: ListServiceProviderFilter): Promise<ServiceProvider[]> => {
    const serviceProviders = await this._serviceProviderRepository.list(filter);

    return serviceProviders;
  }
}

export default ListServiceProvider;