import { PrismaClient, UserType } from '@prisma/client';
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

    await this.prisma.user.create({
      data: {
        id: serviceProvider.id,
        type: UserType.serviceProvider,
        name: serviceProvider.name,
        email: serviceProvider.email,
        password: serviceProvider.password,
        serviceProvider: {
          create: {
            contact: {
              create: contacts,
            },
            description: serviceProvider.description,
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

          }
        },
        profileImage: {
          connect: {
            id: serviceProvider.profileImage?.id,
          },
        },
      },
    });

    return serviceProvider;
  }

  public findByEmail = async (email: string): Promise<ServiceProvider | null> => {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        serviceProvider: {
          include: {
            contact: true,
            addresses: {
              include: { address: true }
            },
            jobArea: true
          }
        },
        profileImage: true,
      },
    });

    if (!user) return null;

    return new ServiceProvider(
      user.id,
      user.name,
      user.email,
      user.password,
      user.serviceProvider[0].contact.map((contact) => new ServiceProviderContact(
        contact.email,
        contact.phone,
        contact.cellphone,
        contact.id,
      )),
      user.serviceProvider[0].description,
      !user.profileImage ? null : new File(
        user.profileImage.originalName,
        user.profileImage.encoding,
        user.profileImage.mimeType,
        user.profileImage.blobName,
        user.profileImage.originalSize,
        user.profileImage.compressedSize,
        user.profileImage.url,
        user.profileImage.id,
      ),
      user.serviceProvider[0].jobMode as JobMode,
      user.serviceProvider[0].addresses.map(({ address }) => new Address(address.cep, address.city, address.state, address.uf, address.id)),
      new JobArea(user.serviceProvider[0].jobArea.title, user.serviceProvider[0].jobArea.id),
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
        user: {
          include: {
            profileImage: true,
          },
        },
        contact: true,
        addresses: {
          include: { address: true }
        },
        jobArea: true
      },
      ...prismaFilter,
    });

    return serviceProviders.map((serviceProvider) => new ServiceProvider(
      serviceProvider.id,
      serviceProvider.user.name,
      serviceProvider.user.email,
      serviceProvider.user.password,
      serviceProvider.contact.map((contact) => new ServiceProviderContact(
        contact.email,
        contact.phone,
        contact.cellphone,
        contact.id,
      )),
      serviceProvider.description,
      !serviceProvider.user.profileImage ? null : new File(
        serviceProvider.user.profileImage.originalName,
        serviceProvider.user.profileImage.encoding,
        serviceProvider.user.profileImage.mimeType,
        serviceProvider.user.profileImage.blobName,
        serviceProvider.user.profileImage.originalSize,
        serviceProvider.user.profileImage.compressedSize,
        serviceProvider.user.profileImage.url,
        serviceProvider.user.profileImage.id,
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
    await this.prisma.user.update({
      where: { id: serviceProvider.id },
      data: {
        name: serviceProvider.name,
        email: serviceProvider.email,
        password: serviceProvider.password,
        profileImage: {
          connect: {
            id: serviceProvider.profileImage?.id,
          },
        },
        serviceProvider: {
          update: {
            where: { id: serviceProvider.id },
            data: {
              contact: {
                create: contacts,
              },
              description: serviceProvider.description,
      
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
          }
        }
      },
    });

    return serviceProvider;
  }

  public findById = async (id: string): Promise<ServiceProvider | null> => {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: { id },
      include: {
        contact: true,
        user: {
          include: {
            profileImage: true,
          },
        },
        addresses: {
          include: { address: true }
        },
        jobArea: true
      },
    });

    if (!serviceProvider) return null;

    return new ServiceProvider(
      serviceProvider.id,
      serviceProvider.user.name,
      serviceProvider.user.email,
      serviceProvider.user.password,
      serviceProvider.contact.map((contact) => new ServiceProviderContact(
        contact.email,
        contact.phone,
        contact.cellphone,
        contact.id,
      )),
      serviceProvider.description,
      !serviceProvider.user.profileImage ? null : new File(
        serviceProvider.user.profileImage.originalName,
        serviceProvider.user.profileImage.encoding,
        serviceProvider.user.profileImage.mimeType,
        serviceProvider.user.profileImage.blobName,
        serviceProvider.user.profileImage.originalSize,
        serviceProvider.user.profileImage.compressedSize,
        serviceProvider.user.profileImage.url,
        serviceProvider.user.profileImage.id,
      ),
      serviceProvider.jobMode as JobMode,
      serviceProvider.addresses.map(({ address }) => new Address(address.cep, address.city, address.state, address.uf, address.id)),
      new JobArea(serviceProvider.jobArea.title, serviceProvider.jobArea.id),
    );
  }
}

export default ServiceProviderRepository;