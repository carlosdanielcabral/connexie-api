import Customer from "../../domain/entities/customer";

interface CustomerRepository {
    create(customer: Customer): Promise<Customer>;
    findByEmail(email: string): Promise<Customer | null>;
    update(customer: Customer): Promise<Customer>;
    findById(id: string): Promise<Customer | null>;
}

export default CustomerRepository;
