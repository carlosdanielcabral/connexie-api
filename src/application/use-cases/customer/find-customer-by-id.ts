import ICustomerRepository from '../../../interfaces/repositories/customer-repository';
import Customer from '../../../domain/entities/customer';

class FindCustomerById {
  constructor(
    private _customerRepository: ICustomerRepository,
  ) {}

  public execute = async (id: Customer['id']): Promise<Customer | null> => {
    return this._customerRepository.findById(id);
  };
}

export default FindCustomerById;
