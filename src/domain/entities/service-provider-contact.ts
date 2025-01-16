class ServiceProviderContact {
    constructor(
      private _email: string,
      private _phone: string,
      private _cellphone: string,
      private _id?: number,
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

    public get id(): number | undefined {
      return this._id;
    }

    public toJson = () => ({
      email: this.email,
      phone: this.phone,
      cellphone: this.cellphone,
      id: this.id,
    })
  }
  
export default ServiceProviderContact;