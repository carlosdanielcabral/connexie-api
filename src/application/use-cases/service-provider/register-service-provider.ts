import { randomUUID } from 'crypto';
import ServiceProvider from '../../../domain/entities/service-provider';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';
import RegisterServiceProviderDTO from '../../dtos/service-provider/register-service-provider';
import ICryptService from '../../../interfaces/services/crypt-service';
import ValidationError from '../../errors/validation-error';

class RegisterServiceProvider {
  constructor(
    private _serviceProviderRepository: IServiceProviderRepository,
    private _cryptService: ICryptService,
  ) {}

  public execute = async (dto: RegisterServiceProviderDTO): Promise<ServiceProvider> => {
    const { id, name, email, password, contacts } = dto;
  
    const serviceProviderContacts = contacts.map(contact => new ServiceProviderContact(
      contact.email,
      contact.phone,
      contact.cellphone
    ));

    const encryptedPassword = this._cryptService.encrypt(password);
  
    const serviceProvider = new ServiceProvider(id, name, email, encryptedPassword, serviceProviderContacts);

    const previousServiceProvider = await this._serviceProviderRepository.findByEmail(email);

    if (previousServiceProvider) throw new ValidationError('This email is already in use');

    return this._serviceProviderRepository.create(serviceProvider);
  };
}

export default RegisterServiceProvider;