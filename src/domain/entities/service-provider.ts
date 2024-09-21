import ServiceProviderContact from "./service-provider-contact";

class ServiceProvider {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public password: string,
      public contacts: ServiceProviderContact[]
    ) {
    }

    public toJson = () => ({
      id: this.id,
      name: this.name,
      email: this.email,
      contacts: this.contacts.map(contact => contact.toJson())
    })
  }
  
export default ServiceProvider;