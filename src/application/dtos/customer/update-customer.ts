class UpdateCustomerDTO {
  constructor(
    public name: string,
    public password?: string,
    public profileImage?: string,
  ) {}
}

export default UpdateCustomerDTO;
