
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import Customer from "../../../domain/entities/customer";
import CustomerRepository from "../../../infrastructure/database/repositories/customer-repository";
import LoginCustomer from "./login-customer";

describe("[Use Case] Login Customer", () => {
    const customerExpected = new Customer(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', '1'),
    );

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new CustomerRepository(prisma);
    const hashService = new HashService();

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return customer after success login", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(customerExpected);

        const useCase = new LoginCustomer(repository, hashService);

        sandbox.stub(hashService, 'compare').returns(true);

        const response = await useCase.execute(customerExpected.email, customerExpected.password);

        expect(response).toBe(customerExpected);
    });

    test("Throw error if customer not found", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new LoginCustomer(repository, hashService);

        await expect(useCase.execute(customerExpected.email, customerExpected.password)).rejects.toThrow('Invalid email or password');
    });

    test("Throw error if password is invalid", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(customerExpected);

        const useCase = new LoginCustomer(repository, hashService);

        sandbox.stub(hashService, 'compare').returns(false);

        await expect(useCase.execute(customerExpected.email, customerExpected.password)).rejects.toThrow('Invalid email or password');
    });
})