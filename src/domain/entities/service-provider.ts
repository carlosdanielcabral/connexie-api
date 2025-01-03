import ServiceProviderContact from "./service-provider-contact";

class ServiceProvider {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public password: string,
      public contacts: ServiceProviderContact[],
      public description: string,
    ) {
    }

    public toJson = () => ({
      id: this.id,
      name: this.name,
      email: this.email,
      contact: this.contacts.map(contact => contact.toJson()),
      description: this.description,
    })
  }
  
export default ServiceProvider;