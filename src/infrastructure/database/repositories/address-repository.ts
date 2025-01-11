import { PrismaClient } from '@prisma/client';
import Address from '../../../domain/entities/address';
import { ListAddressFilter } from '../../../interfaces/repositories/address-repository';
import IAddressRepository from '../../../interfaces/repositories/address-repository';
import { formatPagination } from '../../../utils/pagination';

class AddressRepository implements IAddressRepository {
    constructor(private prisma: PrismaClient = new PrismaClient()) { }

    public list = async (filter: ListAddressFilter): Promise<Address[]> => {
        const pagination = formatPagination(filter);

        const prismaFilter = {
            skip: pagination.page,
            take: pagination.limit,
            where: {},
        };

        if (filter.keyword) {
            prismaFilter.where ={
                OR: [
                    { city: { contains: filter.keyword } },
                    { state: { contains: filter.keyword } },
                ],
            };
        }

        const addresses = await this.prisma.address.findMany(prismaFilter);

        return addresses.map((address) => new Address(address.cep, address.city, address.state, address.uf, address.id));
    }
}

export default AddressRepository;