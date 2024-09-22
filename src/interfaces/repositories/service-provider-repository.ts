import ServiceProvider from "../../domain/entities/service-provider";

interface ServiceProviderRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findByEmail(email: string): Promise<ServiceProvider | null>;
}

export default ServiceProviderRepository;
