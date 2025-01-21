import ValidationError from '../../errors/validation-error';
import HashService from '../../../interfaces/services/hash-service';
import FindFileById from '../file/find-file-by-id';
import ICustomerRepository from '../../../interfaces/repositories/customer-repository';
import UpdateCustomerDTO from '../../dtos/customer/update-customer';
import Customer from '../../../domain/entities/customer';

class UpdateCustomer {
  constructor(
    private _customerRepository: ICustomerRepository,
    private _hashService: HashService,
    private _findFileById: FindFileById,
  ) {}

  public execute = async (dto: UpdateCustomerDTO, who: Customer): Promise<Customer> => {
    const { name, password, profileImage } = dto;

    const file = profileImage ? await this._findFileById.execute(profileImage) : who.profileImage;
  
    if (file === null) throw new ValidationError('Profile image not found');
  
    const encryptedPassword = password ? this._hashService.hash(password) : who.password;
  
    const customer = new Customer(
      who.id,
      name,
      who.email,
      encryptedPassword,
      file,
    );

    return this._customerRepository.update(customer);
  };
}

export default UpdateCustomer;