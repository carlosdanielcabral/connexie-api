import File from "./file";
import JobArea from "./job-area";
import ServiceProviderAddress from "./service-provider-address";
import ServiceProviderContact from "./service-provider-contact";

export enum JobMode {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  BOTH = 'both',
}
class ServiceProvider {
    constructor(
      private _id: string,
      private _name: string,
      private _email: string,
      private _password: string,
      private _contacts: ServiceProviderContact[],
      private _description: string,
      private _profileImage: File | null,
      private _jobMode: JobMode,
      private _addresses: ServiceProviderAddress[],
      private _jobArea: JobArea,
    ) {
    }

    public get id(): string {
      return this._id;
    }

    public get name(): string {
      return this._name;
    }

    public get email(): string {
      return this._email;
    }

    public get password(): string {
      return this._password;
    }

    public get contacts(): ServiceProviderContact[] {
      return this._contacts;
    }

    public get description(): string {
      return this._description;
    }

    public get profileImage(): File | null {
      return this._profileImage;
    }

    public get jobMode(): JobMode {
      return this._jobMode;
    }

    public get addresses(): ServiceProviderAddress[] {
      return this._addresses;
    }

    public get jobArea(): JobArea {
      return this._jobArea;
    }

    public toJson = () => ({
      id: this.id,
      name: this.name,
      email: this.email,
      contact: this.contacts.map(contact => contact.toJson()),
      description: this.description,
      image: this.profileImage?.decryptedUrl,
      jobMode: this.jobMode,
      address: this.addresses.map(address => address.toJson()),
      jobArea: this.jobArea.toJson(),
    })
  }
  
export default ServiceProvider;