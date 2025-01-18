import ServiceProvider, { JobMode } from "../../domain/entities/service-provider";
import { Pagination } from "../../utils/pagination";

interface ServiceProviderRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findByEmail(email: string): Promise<ServiceProvider | null>;
    list(filter?: ListServiceProviderFilter): Promise<ServiceProvider[]>;
    count(): Promise<number>;
    update(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findById(id: string): Promise<ServiceProvider | null>;
}

export type ListServiceProviderFilter = Pagination & {
    keyword?: string;
    addressId?: number;
    jobAreaId?: number;
    jobMode?: JobMode;
};

export default ServiceProviderRepository;
