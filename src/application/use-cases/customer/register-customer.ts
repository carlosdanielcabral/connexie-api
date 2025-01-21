import ValidationError from '../../errors/validation-error';
import HashService from '../../../interfaces/services/hash-service';
import FindFileById from '../file/find-file-by-id';
import ICustomerRepository from '../../../interfaces/repositories/customer-repository';
import RegisterCustomerDTO from '../../dtos/customer/register-customer';
import Customer from '../../../domain/entities/customer';

class RegisterCustomer {
  constructor(
    private _customerRepository: ICustomerRepository,
    private _hashService: HashService,
    private _findFileById: FindFileById,
  ) {}

  public execute = async (dto: RegisterCustomerDTO): Promise<Customer> => {
    const { id, name, email, password, profileImage } = dto;

    const previousCustomer = await this._customerRepository.findByEmail(email);

    if (previousCustomer) throw new ValidationError('This email is already in use');

    const file = await this._findFileById.execute(profileImage);
  
    if (file === null) throw new ValidationError('Profile image not found');

    const encryptedPassword = this._hashService.hash(password);
  
    const customer = new Customer(
      id,
      name,
      email,
      encryptedPassword,
      file,
    );

    return this._customerRepository.create(customer);
  };
}

export default RegisterCustomer;