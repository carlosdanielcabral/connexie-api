import ServiceProvider from '../../../domain/entities/service-provider';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';
import RegisterServiceProviderDTO from '../../dtos/service-provider/register-service-provider';
import ValidationError from '../../errors/validation-error';
import HashService from '../../../interfaces/services/hash-service';
import FindFileById from '../file/find-file-by-id';
import FindJobAreaById from '../job-area/find-job-area-by-id';
import Address from '../../../domain/entities/address';
import UpdateServiceProviderDTO from '../../dtos/service-provider/update-service-provider';

class UpdateServiceProvider {
  constructor(
    private _serviceProviderRepository: IServiceProviderRepository,
    private _hashService: HashService,
    private _findFileById: FindFileById,
    private _findJobAreaById: FindJobAreaById,
  ) {}

  public execute = async (dto: UpdateServiceProviderDTO, who: ServiceProvider): Promise<ServiceProvider> => {
    const { name, password, contacts, description, profileImage } = dto;

    const file = profileImage ? await this._findFileById.execute(profileImage) : who.profileImage;
  
    if (file === null) throw new ValidationError('Profile image not found');

    const jobArea = await this._findJobAreaById.execute(dto.jobAreaId);

    if (jobArea === null) throw new ValidationError('Job area not found');

    const serviceProviderContacts = contacts.map(contact => new ServiceProviderContact(
      contact.email,
      contact.phone,
      contact.cellphone,
    ));

    const serviceProviderAddresses = !dto.address ? [] : [
      new Address(dto.address.cep, dto.address.city, dto.address.state, dto.address.uf)
    ];
  
    const encryptedPassword = password ? this._hashService.hash(password) : who.password;
  
    const serviceProvider = new ServiceProvider(
      who.id,
      name,
      who.email,
      encryptedPassword,
      serviceProviderContacts,
      description,
      file,
      dto.jobMode,
      serviceProviderAddresses,
      jobArea,
    );

    return this._serviceProviderRepository.update(serviceProvider);
  };
}

export default UpdateServiceProvider;