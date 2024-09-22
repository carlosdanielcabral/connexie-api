import ServiceProviderContact from "./service-provider-contact";

class ServiceProvider {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public password: string,
      public contact: ServiceProviderContact[]
    ) {
    }

    public toJson = () => ({
      id: this.id,
      name: this.name,
      email: this.email,
      contact: this.contact.map(contact => contact.toJson())
    })
  }
  
export default ServiceProvider;