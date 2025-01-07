import { PrismaClient } from '@prisma/client';
import ServiceProvider, { JobMode } from '../../../domain/entities/service-provider';
import IServiceProviderRepository, { ListServiceProviderFilter } from '../../../interfaces/repositories/service-provider-repository';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import File from '../../../domain/entities/file';
import ServiceProviderAddress from '../../../domain/entities/service-provider-address';

class ServiceProviderRepository implements IServiceProviderRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public create = async (serviceProvider: ServiceProvider): Promise<ServiceProvider> => {
    const contacts = serviceProvider.contacts.map((contact) => contact.toJson());
    const addresses = serviceProvider.addresses.map((address) => address.toJson());

    await this.prisma.serviceProvider.create({
      include: {
        contact: true,
        addresses: true,
      },
      data: {
        id: serviceProvider.id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        password: serviceProvider.password,
        contact: {
          create: contacts,
        },
        description: serviceProvider.description,
        profileImage: {
          connect: {
            id: serviceProvider.profileImage?.id,
          },
        },
        jobMode: serviceProvider.jobMode,
        addresses: {
          create: addresses,
        }
      },
    });

    return serviceProvider;
  }

  public findByEmail = async (email: string): Promise<ServiceProvider | null> => {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: { email },
      include: { contact: true, profileImage: true, addresses: true },
    });

    if (!serviceProvider) return null;

    return new ServiceProvider(
      serviceProvider.id,
      serviceProvider.name,
      serviceProvider.email,
      serviceProvider.password,
      serviceProvider.contact.map((contact) => new ServiceProviderContact(
        contact.email,
        contact.phone,
        contact.cellphone,
      )),
      serviceProvider.description,
      !serviceProvider.profileImage ? null : new File(
        serviceProvider.profileImage.originalName,
        serviceProvider.profileImage.encoding,
        serviceProvider.profileImage.mimeType,
        serviceProvider.profileImage.blobName,
        serviceProvider.profileImage.originalSize,
        serviceProvider.profileImage.compressedSize,
        serviceProvider.profileImage.url,
        serviceProvider.profileImage.id,
      ),
      serviceProvider.jobMode as JobMode,
      serviceProvider.addresses.map((address) => new ServiceProviderAddress(address.cep, address.city, address.state, address.uf, address.id)),
    );
  }

  public list = async (filter: ListServiceProviderFilter = { page: 1, limit: 10 }): Promise<ServiceProvider[]> => {
    const prismaFilter = {
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      where: {},
    };

    if (filter.keyword) {
      prismaFilter.where = {
        OR: [
          { name: { contains: filter.keyword } },
          { email: { contains: filter.keyword } },
          { description: { contains: filter.keyword } },
        ],
      };
    }

    const serviceProviders = await this.prisma.serviceProvider.findMany({
      include: { contact: true, profileImage: true, addresses: true },
      ...prismaFilter,
    });

    return serviceProviders.map((serviceProvider) => new ServiceProvider(
      serviceProvider.id,
      serviceProvider.name,
      serviceProvider.email,
      serviceProvider.password,
      serviceProvider.contact.map((contact) => new ServiceProviderContact(
        contact.email,
        contact.phone,
        contact.cellphone,
      )),
      serviceProvider.description,
      !serviceProvider.profileImage ? null : new File(
        serviceProvider.profileImage.originalName,
        serviceProvider.profileImage.encoding,
        serviceProvider.profileImage.mimeType,
        serviceProvider.profileImage.blobName,
        serviceProvider.profileImage.originalSize,
        serviceProvider.profileImage.compressedSize,
        serviceProvider.profileImage.url,
        serviceProvider.profileImage.id,
      ),
      serviceProvider.jobMode as JobMode,
      serviceProvider.addresses.map((address) => new ServiceProviderAddress(address.cep, address.city, address.state, address.uf, address.id)),
    ));
  }
}

export default ServiceProviderRepository;