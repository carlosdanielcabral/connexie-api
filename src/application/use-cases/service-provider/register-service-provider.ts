import ServiceProvider from '../../../domain/entities/service-provider';
import ServiceProviderContact from '../../../domain/entities/service-provider-contact';
import IServiceProviderRepository from '../../../interfaces/repositories/service-provider-repository';
import RegisterServiceProviderDTO from '../../dtos/service-provider/register-service-provider';
import ICryptService from '../../../interfaces/services/crypt-service';
import ValidationError from '../../errors/validation-error';
import File from '../../../domain/entities/file';
import FileService from '../../../infrastructure/services/file-service';
import fs from 'fs/promises';

class RegisterServiceProvider {
  constructor(
    private _serviceProviderRepository: IServiceProviderRepository,
    private _cryptService: ICryptService,
    private _fileService: FileService,
  ) {}

  public execute = async (dto: RegisterServiceProviderDTO): Promise<ServiceProvider> => {
    const { id, name, email, password, contacts, description, profileImage } = dto;
  
    const serviceProviderContacts = contacts.map(contact => new ServiceProviderContact(
      contact.email,
      contact.phone,
      contact.cellphone
    ));

    const serviceProviderImage = new File(
      profileImage.originalName,
      profileImage.encoding,
      profileImage.mimeType,
      profileImage.blobName,
      profileImage.size
    );

    const encryptedPassword = this._cryptService.encrypt(password);
  
    const serviceProvider = new ServiceProvider(id, name, email, encryptedPassword, serviceProviderContacts, description, serviceProviderImage);

    const previousServiceProvider = await this._serviceProviderRepository.findByEmail(email);

    if (previousServiceProvider) throw new ValidationError('This email is already in use');

    const entity = await this._serviceProviderRepository.create(serviceProvider);
    
    const fileBuffer = await fs.readFile(profileImage.tempPath);

    await this._fileService.save(profileImage.blobName, fileBuffer);
  
    return entity;
  };
}

export default RegisterServiceProvider;