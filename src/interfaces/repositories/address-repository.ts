import Address from "../../domain/entities/address";
import { Pagination } from "../../utils/pagination";

export type ListAddressFilter = Pagination & {
    keyword?: string;
};

interface AddressRepository {
    list(filter?: ListAddressFilter): Promise<Address[]>;
}

export default AddressRepository;
