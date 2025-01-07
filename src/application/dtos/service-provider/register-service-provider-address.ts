class RegisterServiceProviderAddressDTO {
  constructor(
    public cep: string,
    public city: string,
    public state: string,
    public uf: string,
  ) {}
}

export default RegisterServiceProviderAddressDTO;