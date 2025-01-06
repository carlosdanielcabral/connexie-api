import ServiceProvider from '../../../domain/entities/service-provider';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';
import RegisterServiceProviderDTO from '../../dtos/service-provider/register-service-provider';
import ValidationError from '../../errors/validation-error';
import RegisterFile from '../file/register-file';
import HashService from '../../../interfaces/services/hash-service';

class RegisterServiceProvider {
  constructor(
    private _serviceProviderRepository: IServiceProviderRepository,
    private _hashService: HashService,
    private _registerFile: RegisterFile,
  ) {}

  public execute = async (dto: RegisterServiceProviderDTO): Promise<ServiceProvider> => {
    const { id, name, email, password, contacts, description, profileImage } = dto;

    const previousServiceProvider = await this._serviceProviderRepository.findByEmail(email);

    if (previousServiceProvider) throw new ValidationError('This email is already in use');

    const serviceProviderContacts = contacts.map(contact => new ServiceProviderContact(
      contact.email,
      contact.phone,
      contact.cellphone
    ));

    const file = await this._registerFile.execute(profileImage);
  
    const encryptedPassword = this._hashService.hash(password);
  
    const serviceProvider = new ServiceProvider(id, name, email, encryptedPassword, serviceProviderContacts, description, file);

    return this._serviceProviderRepository.create(serviceProvider);
  };
}

export default RegisterServiceProvider;