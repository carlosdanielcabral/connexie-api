import Address from "../../../domain/entities/address";
import IAddressRepository, { ListAddressFilter } from "../../../interfaces/repositories/address-repository";

class ListAddress {
  constructor(
    private readonly _addressRepository: IAddressRepository,
) {}

  public execute = async (filter: ListAddressFilter): Promise<Address[]> => {
    const addresses = await this._addressRepository.list(filter);

    return addresses;
  }
}

export default ListAddress;