
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import fs from 'fs/promises';
import CryptService from "../../../infrastructure/services/crypt-service";
import FindFileById from "../file/find-file-by-id";
import Customer from "../../../domain/entities/customer";
import RegisterCustomerDTO from "../../dtos/customer/register-customer";
import CustomerRepository from "../../../infrastructure/database/repositories/customer-repository";
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import RegisterCustomer from "./register-customer";

describe("[Use Case] Register Customer", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');

    const customerExpected = new Customer(
        'test-id',
        'Test Name',
        'test@email.com', 
        'test-password',
        file,
    );

    const dto = new RegisterCustomerDTO(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        'uuid',
    );

    const prisma = Sinon.createStubInstance(PrismaClient);

    const repository = new CustomerRepository(prisma);
    const fileRepository = new FileRepository(prisma);
    const findFileById = new FindFileById(fileRepository);

    const hashService = new HashService();
    const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(repository, 'create').resolves(customerExpected);
        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');
    });

    afterEach(() => {
        sandbox.restore();
    });

    test("Return customer after success insertion", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new RegisterCustomer(repository, hashService, findFileById);

        const response = await useCase.execute(dto);

        expect(response).toBe(customerExpected);
    });

    test("Throw error if email is already in use", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(repository, 'findByEmail').resolves(customerExpected);

        const useCase = new RegisterCustomer(repository, hashService, findFileById);

        await expect(useCase.execute(dto)).rejects.toThrow('This email is already in use');
    });

    test("Throw error if profile image not found", async () => {
        sandbox.stub(findFileById, 'execute').resolves(null);
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new RegisterCustomer(repository, hashService, findFileById);

        await expect(useCase.execute(dto)).rejects.toThrow('Profile image not found');
    });
})