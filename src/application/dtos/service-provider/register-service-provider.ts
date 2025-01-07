import { randomUUID } from 'crypto';
import { JobMode } from '../../../domain/entities/service-provider';
import RegisterServiceProviderAddressDTO from './register-service-provider-address';
import RegisterServiceProviderContactDTO from './register-service-provider-contact';

class RegisterServiceProviderDTO {
  constructor(
    public id: string = randomUUID(),
    public name: string,
    public email: string,
    public password: string,
    public contacts: RegisterServiceProviderContactDTO[],
    public description: string,
    public profileImage: string,
    public jobMode: JobMode,
    public address?: RegisterServiceProviderAddressDTO,
  ) {}
}

export default RegisterServiceProviderDTO;