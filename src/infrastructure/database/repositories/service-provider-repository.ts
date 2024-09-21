import { PrismaClient } from '@prisma/client';
import ServiceProvider from '../../../domain/entities/service-provider';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';

class ServiceProviderRepository implements IServiceProviderRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public create = async (serviceProvider: ServiceProvider): Promise<ServiceProvider> => {
    const contacts = serviceProvider.contacts.map((contact) => contact.toJson());

    await this.prisma.serviceProvider.create({
      include: {
        contact: true,
      },
      data: {
        id: serviceProvider.id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        password: serviceProvider.password,
        contact: {
          create: contacts,
        },
      },
    });

    return serviceProvider;
  }
}

export default ServiceProviderRepository;