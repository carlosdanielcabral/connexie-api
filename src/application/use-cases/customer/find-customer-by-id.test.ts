
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import Customer from "../../../domain/entities/customer";
import CustomerRepository from "../../../infrastructure/database/repositories/customer-repository";
import FindCustomerById from "./find-customer-by-id";

describe("[Use Case] Find Customer by id", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');

    const customerExpected = new Customer(
        'test-id',
        'Test Name',
        'test@email.com', 
        'test-password',
        file,
    );

    const prisma = Sinon.createStubInstance(PrismaClient);

    const repository = new CustomerRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return customer if found", async () => {
        sandbox.stub(repository, 'findById').resolves(customerExpected);

        const useCase = new FindCustomerById(repository);

        const response = await useCase.execute('test-id');

        expect(JSON.stringify(response)).toBe(JSON.stringify(customerExpected));
    });

    test("Return null if customer not found", async () => {
        sandbox.stub(repository, 'findById').resolves(null);

        const useCase = new FindCustomerById(repository);

        expect(await useCase.execute('test')).toBeNull();
    });
})