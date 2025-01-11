import ServiceProvider from "../../domain/entities/service-provider";

export type ListAddressFilter ={
    keyword?: string;
}

interface AddressRepository {
    create(serviceProvider: ServiceProvider): Promise<ServiceProvider>;
    findByEmail(email: string): Promise<ServiceProvider | null>;
    list(filter?: ListAddressFilter): Promise<ServiceProvider[]>;
    count(): Promise<number>;
}

export default AddressRepository;
