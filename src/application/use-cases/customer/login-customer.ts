import Customer from "../../../domain/entities/customer";
import ICustomerRepository from "../../../interfaces/repositories/customer-repository";
import HashService from "../../../interfaces/services/hash-service";
import ValidationError from "../../errors/validation-error";

class LoginCustomer {
  constructor(
    private readonly _customerRepository: ICustomerRepository,
    private readonly _hashService: HashService,
) {}

  public execute = async (email: string, password: string): Promise<Customer> => {
    const customer = await this._customerRepository.findByEmail(email);

    if (!customer) throw new ValidationError('Invalid email or password');

    const isSamePassword = this._hashService.compare(password, customer.password);

    if (!isSamePassword) throw new ValidationError('Invalid email or password');

    return customer;
  }
}

export default LoginCustomer;