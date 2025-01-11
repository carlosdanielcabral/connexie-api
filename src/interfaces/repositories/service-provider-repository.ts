import ServiceProvider from "../../domain/entities/service-provider";
import { Pagination } from "../../utils/pagination";

interface ServiceProviderRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findByEmail(email: string): Promise<ServiceProvider | null>;
    list(filter?: ListServiceProviderFilter): Promise<ServiceProvider[]>;
    count(): Promise<number>;
}

export type ListServiceProviderFilter = Pagination & {
    keyword?: string;
};

export default ServiceProviderRepository;
