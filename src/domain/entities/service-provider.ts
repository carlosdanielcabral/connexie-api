import Address from "./address";
import File from "./file";
import JobArea from "./job-area";
import ServiceProviderContact from "./service-provider-contact";
import User from "./user";

export enum JobMode {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  BOTH = 'both',
}
class ServiceProvider extends User {
  private _description: string;
  private _contacts: ServiceProviderContact[];
  private _jobMode: JobMode;
  private _addresses: Address[];
  private _jobArea: JobArea;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    contacts: ServiceProviderContact[],
    description: string,
    profileImage: File | null,
    jobMode: JobMode,
    addresses: Address[],
    jobArea: JobArea,
  ) {
    super(id, name, email, password, profileImage);

    this._contacts = contacts;
    this._description = description;
    this._jobMode = jobMode;
    this._addresses = addresses;
    this._jobArea = jobArea;
  }

  public get contacts(): ServiceProviderContact[] {
    return this._contacts;
  }

  public get description(): string {
    return this._description;
  }

  public get jobMode(): JobMode {
    return this._jobMode;
  }

  public get addresses(): Address[] {
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

  public toPublicJson = () => ({
    id: this.id,
    name: this.name,
    contact: this.contacts.map(contact => contact.toJson()),
    description: this.description,
    image: this.profileImage?.decryptedUrl,
    jobMode: this.jobMode,
    address: this.addresses.map(address => address.toJson()),
    jobArea: this.jobArea.toJson(),
  })
}

export default ServiceProvider;