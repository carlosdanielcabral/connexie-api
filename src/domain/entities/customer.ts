import File from "./file";
import User from "./user";

class Customer extends User {
  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    profileImage: File | null,
  ) {
    super(id, name, email, password, profileImage);
  }
}

export default Customer;