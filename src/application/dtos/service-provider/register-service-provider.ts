import { randomUUID } from 'crypto';
import RegisterServiceProviderContactDTO from './register-service-provider-contact';
import RegisterServiceProviderImageDTO from './register-service-provider-image';

class RegisterServiceProviderDTO {
  constructor(
    public id: string = randomUUID(),
    public name: string,
    public email: string,
    public password: string,
    public contacts: RegisterServiceProviderContactDTO[],
    public description: string,
    public profileImage: RegisterServiceProviderImageDTO,
  ) {}
}

export default RegisterServiceProviderDTO;