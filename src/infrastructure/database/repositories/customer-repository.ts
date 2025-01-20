import { PrismaClient } from '@prisma/client';
import File from '../../../domain/entities/file';
import Customer from '../../../domain/entities/customer';
import ICustomerRepository from '../../../interfaces/repositories/customer-repository';

class CustomerRepository implements ICustomerRepository{
  constructor(private prisma: PrismaClient = new PrismaClient()) { }

  public create = async (customer: Customer): Promise<Customer> => {
    await this.prisma.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
        profileImage: {
          connect: {
            id: customer.profileImage?.id,
          },
        }
      },
    });

    return customer;
  }

  public findByEmail = async (email: string): Promise<Customer | null> => {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
      include: { profileImage: true },
    });

    if (!customer) return null;

    return new Customer(
      customer.id,
      customer.name,
      customer.email,
      customer.password,
      !customer.profileImage ? null : new File(
        customer.profileImage.originalName,
        customer.profileImage.encoding,
        customer.profileImage.mimeType,
        customer.profileImage.blobName,
        customer.profileImage.originalSize,
        customer.profileImage.compressedSize,
        customer.profileImage.url,
        customer.profileImage.id,
      ),
    );
  }

  public update = async (customer: Customer): Promise<Customer> => {
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        password: customer.password,
        profileImage: {
          connect: {
            id: customer.profileImage?.id,
          },
        },
      },
    });

    return customer;
  }

  public findById = async (id: string): Promise<Customer | null> => {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        profileImage: true,
      },
    });

    if (!customer) return null;

    return new Customer(
      customer.id,
      customer.name,
      customer.email,
      customer.password,
      !customer.profileImage ? null : new File(
        customer.profileImage.originalName,
        customer.profileImage.encoding,
        customer.profileImage.mimeType,
        customer.profileImage.blobName,
        customer.profileImage.originalSize,
        customer.profileImage.compressedSize,
        customer.profileImage.url,
        customer.profileImage.id,
      ),
    );
  }
}

export default CustomerRepository;