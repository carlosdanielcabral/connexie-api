import RegisterServiceProviderContactDTO from './register-service-provider-contact';

class RegisterServiceProviderDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public contacts: RegisterServiceProviderContactDTO[]
  ) {}
}

export default RegisterServiceProviderDTO;