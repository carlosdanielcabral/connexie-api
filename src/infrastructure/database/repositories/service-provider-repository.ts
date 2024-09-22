import { PrismaClient } from '@prisma/client';
import ServiceProvider from '../../../domain/entities/service-provider';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';

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

  public findByEmail = async (email: string): Promise<ServiceProvider | null> => {
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: { email },
      include: { contact: true },
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
    );
  }
}

export default ServiceProviderRepository;