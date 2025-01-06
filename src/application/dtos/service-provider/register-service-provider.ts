import { randomUUID } from 'crypto';
import RegisterServiceProviderContactDTO from './register-service-provider-contact';
import RegisterFileDTO from '../file/register-file';

class RegisterServiceProviderDTO {
  constructor(
    public id: string = randomUUID(),
    public name: string,
    public email: string,
    public password: string,
    public contacts: RegisterServiceProviderContactDTO[],
    public description: string,
    public profileImage: RegisterFileDTO,
  ) {}
}

export default RegisterServiceProviderDTO;