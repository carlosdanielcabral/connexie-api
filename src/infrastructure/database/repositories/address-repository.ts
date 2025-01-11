import { PrismaClient } from '@prisma/client';
import Address from '../../../domain/entities/address';
import { ListAddressFilter } from '../../../interfaces/repositories/address-repository';

class AddressRepository {
    constructor(private prisma: PrismaClient = new PrismaClient()) { }

    public list = async (filter: ListAddressFilter): Promise<Address[]> => {
        const prismaFilter = {
            take: 10,
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