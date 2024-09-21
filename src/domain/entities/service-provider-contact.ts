class ServiceProviderContact {
    constructor(
      public email: string,
      public phone: string,
      public cellphone: string,
    ) {}

    public toJson = () => ({
      email: this.email,
      phone: this.phone,
      cellphone: this.cellphone,
    })
  }
  
export default ServiceProviderContact;