
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import fs from 'fs/promises';
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import CryptService from "../../../infrastructure/services/crypt-service";
import FindFileById from "../file/find-file-by-id";
import Customer from "../../../domain/entities/customer";
import UpdateCustomerDTO from "../../dtos/customer/update-customer";
import CustomerRepository from "../../../infrastructure/database/repositories/customer-repository";
import UpdateCustomer from "./update-customer";

describe("[Use Case] Update Service Provider", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');

    const who = new Customer(
        'test-id',
        'Test Name',
        'test@email.com', 
        'test-password',
        file,
    );

    const customerExpected = new Customer(
        'test-id',
        'Test Name Edited',
        'test@email.com', 
        'test-password',
        file,
    );

    const dto = new UpdateCustomerDTO(
        'Test Name Edited',
        'password',
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
        sandbox.stub(repository, 'update').resolves(customerExpected);
        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');
    });

    afterEach(() => {
        sandbox.restore();
    });

    test("Return customer after success update", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);

        const useCase = new UpdateCustomer(repository, hashService, findFileById);

        const response = await useCase.execute(dto, who);

        expect(response).toBe(customerExpected);
    });

    test("Throw error if profile image not found", async () => {
        sandbox.stub(findFileById, 'execute').resolves(null);

        const useCase = new UpdateCustomer(repository, hashService, findFileById);

        await expect(useCase.execute(dto, who)).rejects.toThrow('Profile image not found');
    });
})