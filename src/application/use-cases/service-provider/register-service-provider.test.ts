
import { PrismaClient } from "@prisma/client";
import Sinon, { SinonStubbedInstance } from "sinon";
import RegisterServiceProviderDTO from "../../dtos/service-provider/register-service-provider";
import RegisterServiceProviderContactDTO from "../../dtos/service-provider/register-service-provider-contact";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import RegisterServiceProvider from "./register-service-provider";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import fs from 'fs/promises';
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import RegisterFile from "../file/register-file";
import CryptService from "../../../infrastructure/services/crypt-service";
import FindFileById from "../file/find-file-by-id";

describe("[Use Case] Register Service Provider", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');

    const serviceProviderExpected = new ServiceProvider(
        'test-id',
        'Test Name',
        'test@email.com', 
        'test-password',
        [new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone')],
        'Test description',
        file
    );

    const dto = new RegisterServiceProviderDTO(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        [new RegisterServiceProviderContactDTO('test-email', 'test-phone', 'test-cellphone')],
        'Test description',
        'uuid'
    );

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new ServiceProviderRepository(prisma);
    const fileRepository = new FileRepository(prisma);
    const findFileById = new FindFileById(fileRepository);

    const hashService = new HashService();
    const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(repository, 'create').resolves(serviceProviderExpected);
        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');
    });

    afterEach(() => {
        sandbox.restore();
    });

    test("Return service provider after success insertion", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new RegisterServiceProvider(repository, hashService, findFileById);

        const response = await useCase.execute(dto);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if email is already in use", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(repository, 'findByEmail').resolves(serviceProviderExpected);

        const useCase = new RegisterServiceProvider(repository, hashService, findFileById);

        await expect(useCase.execute(dto)).rejects.toThrow('This email is already in use');
    });

    test("Throw error if profile image not found", async () => {
        sandbox.stub(findFileById, 'execute').resolves(null);
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new RegisterServiceProvider(repository, hashService, findFileById);

        await expect(useCase.execute(dto)).rejects.toThrow('Profile image not found');
    });
})