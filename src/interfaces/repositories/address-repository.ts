import Address from "../../domain/entities/address";

export type ListAddressFilter ={
    keyword?: string;
}

interface AddressRepository {
    list(filter?: ListAddressFilter): Promise<Address[]>;
}

export default AddressRepository;
