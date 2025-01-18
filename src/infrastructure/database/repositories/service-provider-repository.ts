import { PrismaClient } from '@prisma/client';
import ServiceProvider, { JobMode } from '../../../domain/entities/service-provider';
import IServiceProviderRepository, { ListServiceProviderFilter } from '../../../interfaces/repositories/service-provider-repository';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import File from '../../../domain/entities/file';
import JobArea from '../../../domain/entities/job-area';
import Address from '../../../domain/entities/address';
import { formatPagination } from '../../../utils/pagination';

class ServiceProviderRepository implements IServiceProviderRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) { }

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
          create: addresses.map((address) => ({
            address: {
              connectOrCreate: {
                where: { cep_city_state_uf: { cep: address.cep, city: address.city, state: address.state, uf: address.uf } },
                create: {
                  cep: address.cep,
                  city: address.city,
                  state: address.state,
                  uf: address.uf,
                }
              },
            }
          }))
        },
        jobArea: {
          connect: {
            id: serviceProvider.jobArea.id,
          },
        },
      },
    });

    return serviceProvider;
  }

  public findByEmail = async (email: string): Promise<ServiceProvider | null> => {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: { email },
      include: {
        contact: true,
        profileImage: true,
        addresses: {
          include: { address: true }
        },
        jobArea: true
      },
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
        contact.id,
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
      serviceProvider.addresses.map(({ address }) => new Address(address.cep, address.city, address.state, address.uf, address.id)),
      new JobArea(serviceProvider.jobArea.title, serviceProvider.jobArea.id),
    );
  }

  public list = async (filter: ListServiceProviderFilter = { page: 1, limit: 10 }): Promise<ServiceProvider[]> => {
    const pagination = formatPagination(filter);

    const prismaFilter = {
      skip: pagination.page,
      take: pagination.limit,
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

    if (filter.addressId) {
      prismaFilter.where = {
        ...prismaFilter.where,
        addresses: {
          some: {
            addressId: filter.addressId,
          },
        },
      };
    }

    if (filter.jobAreaId) {
      prismaFilter.where = {
        ...prismaFilter.where,
        jobAreaId: filter.jobAreaId,
      };
    }

    if (filter.jobMode) {
      prismaFilter.where = {
        ...prismaFilter.where,
        jobMode: filter.jobMode,
      };
    }

    const serviceProviders = await this.prisma.serviceProvider.findMany({
      include: {
        contact: true,
        profileImage: true,
        addresses: {
          include: { address: true }
        },
        jobArea: true
      },
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
        contact.id,
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
      serviceProvider.addresses.map(({ address }) => new Address(address.cep, address.city, address.state, address.uf, address.id)),
      new JobArea(serviceProvider.jobArea.title, serviceProvider.jobArea.id),
    ));
  }

  public count = async (): Promise<number> => {
    const count = await this.prisma.serviceProvider.count();

    return count;
  }

  public update = async (serviceProvider: ServiceProvider): Promise<ServiceProvider> => {
    const contacts = serviceProvider.contacts.map((contact) => contact.toJson());
    const addresses = serviceProvider.addresses.map((address) => address.toJson());

    // clear previous contacts
    await this.prisma.serviceProviderContact.deleteMany({
      where: { serviceProviderId: serviceProvider.id },
    });

    // clear previous addresses
    await this.prisma.serviceProviderAddress.deleteMany({
      where: { serviceProviderId: serviceProvider.id },
    });

    // update the data with the new relations
    await this.prisma.serviceProvider.update({
      where: { id: serviceProvider.id },
      include: {
        contact: true,
        addresses: {
          include: {
            address: true,
          },
        },
      },
      data: {
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
          create: addresses.map((address) => ({
            address: {
              connectOrCreate: {
                where: { cep_city_state_uf: { cep: address.cep, city: address.city, state: address.state, uf: address.uf } },
                create: {
                  cep: address.cep,
                  city: address.city,
                  state: address.state,
                  uf: address.uf,
                }
              },
            }
          }))
        },
        jobArea: {
          connect: {
            id: serviceProvider.jobArea.id,
          },
        },
      },
    });

    return serviceProvider;
  }

  public findById = async (id: string): Promise<ServiceProvider | null> => {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: { id },
      include: {
        contact: true,
        profileImage: true,
        addresses: {
          include: { address: true }
        },
        jobArea: true
      },
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
        contact.id,
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
      serviceProvider.addresses.map(({ address }) => new Address(address.cep, address.city, address.state, address.uf, address.id)),
      new JobArea(serviceProvider.jobArea.title, serviceProvider.jobArea.id),
    );
  }
}

export default ServiceProviderRepository;