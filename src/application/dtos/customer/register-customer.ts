import { randomUUID } from 'crypto';

class RegisterCustomerDTO {
  constructor(
    public id: string = randomUUID(),
    public name: string,
    public email: string,
    public password: string,
    public profileImage: string,
  ) {}
}

export default RegisterCustomerDTO;
