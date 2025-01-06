class ServiceProviderContact {
    constructor(
      private _email: string,
      private _phone: string,
      private _cellphone: string,
    ) {}

    public get email(): string {
      return this._email;
    }

    public get phone(): string {
      return this._phone;
    }

    public get cellphone(): string {
      return this._cellphone;
    }

    public toJson = () => ({
      email: this.email,
      phone: this.phone,
      cellphone: this.cellphone,
    })
  }
  
export default ServiceProviderContact;