import { PrismaClient } from '@prisma/client';
import { ServiceProvider } from '../../../domain/entities/service-provider';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';

class ServiceProviderRepository implements IServiceProviderRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  async create(serviceProvider: ServiceProvider): Promise<ServiceProvider> {
    return this.prisma.serviceProvider.create({
      data: {
        name: serviceProvider.name,
        email: serviceProvider.email,
        password: serviceProvider.password,
        contact: {
          create: {
            email: serviceProvider.contact.email,
            phone: serviceProvider.contact.phone,
            region: serviceProvider.contact.region,
          },
        },
      },
    });
  }
}

export default ServiceProviderRepository;