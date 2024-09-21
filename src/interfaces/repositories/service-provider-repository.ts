import ServiceProvider from "../../domain/entities/service-provider";

interface ServiceProviderRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
}

export default ServiceProviderRepository;
