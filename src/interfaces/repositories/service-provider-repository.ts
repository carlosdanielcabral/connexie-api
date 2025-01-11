import ServiceProvider from "../../domain/entities/service-provider";

interface ServiceProviderRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findByEmail(email: string): Promise<ServiceProvider | null>;
    list(filter?: ListServiceProviderFilter): Promise<ServiceProvider[]>;
    count(): Promise<number>;
}

export type ListServiceProviderFilter ={
    keyword?: string;
    page: number;
    limit: number;
}

export default ServiceProviderRepository;
