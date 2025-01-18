
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider, { JobMode } from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import fs from 'fs/promises';
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import CryptService from "../../../infrastructure/services/crypt-service";
import FindFileById from "../file/find-file-by-id";
import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "../../../infrastructure/database/repositories/job-area-repository";
import FindJobAreaById from "../job-area/find-job-area-by-id";
import Address from "../../../domain/entities/address";
import UpdateServiceProviderDTO from "../../dtos/service-provider/update-service-provider";
import UpdateServiceProviderContactDTO from "../../dtos/service-provider/update-service-provider-contact";
import UpdateServiceProviderAddressDTO from "../../dtos/service-provider/update-service-provider-address";
import UpdateServiceProvider from "./update-service-provider";

describe("[Use Case] Update Service Provider", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');
    const jobArea = new JobArea('Test Job Area', 1);

    const who = new ServiceProvider(
        'test-id',
        'Test Name',
        'test@email.com', 
        'test-password',
        [new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone')],
        'Test description',
        file,
        JobMode.ONSITE,
        [new Address('cep', 'city', 'state', 'uf', 1)],
        new JobArea('Test Job Area', 1),
    );

    const serviceProviderExpected = new ServiceProvider(
        'test-id',
        'Test Name Edited',
        'test@email.com', 
        'test-password',
        [new ServiceProviderContact('test-email-edited', 'test-phone-edited', 'test-cellphone-edited')],
        'Test description edited',
        file,
        JobMode.ONSITE,
        [new Address('cep', 'city', 'state', 'uf', 2)],
        new JobArea('Test Job Area', 1),
    );

    const dto = new UpdateServiceProviderDTO(
        'Test Name Edited',
        [new UpdateServiceProviderContactDTO('test-email-edited', 'test-phone-edited', 'test-cellphone-edited')],
        'Test description edited',
        JobMode.ONSITE,
        2,
        'uuid',
        new UpdateServiceProviderAddressDTO('cep', 'city', 'state', 'uf'),
        'test-password',
    );

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new ServiceProviderRepository(prisma);
    const jobAreaRepository = new JobAreaRepository(prisma);
    const fileRepository = new FileRepository(prisma);
    const findFileById = new FindFileById(fileRepository);
    const findJobAreaById = new FindJobAreaById(jobAreaRepository);

    const hashService = new HashService();
    const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(repository, 'update').resolves(serviceProviderExpected);
        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');
    });

    afterEach(() => {
        sandbox.restore();
    });

    test("Return service provider after success update", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(jobAreaRepository, 'findById').resolves(jobArea);

        const useCase = new UpdateServiceProvider(repository, hashService, findFileById, findJobAreaById);

        const response = await useCase.execute(dto, who);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if profile image not found", async () => {
        sandbox.stub(findFileById, 'execute').resolves(null);
        sandbox.stub(jobAreaRepository, 'findById').resolves(jobArea);

        const useCase = new UpdateServiceProvider(repository, hashService, findFileById, findJobAreaById);

        await expect(useCase.execute(dto, who)).rejects.toThrow('Profile image not found');
    });

    test("Throw error if job area not found", async () => {
        sandbox.stub(findFileById, 'execute').resolves(file);
        sandbox.stub(jobAreaRepository, 'findById').resolves(null);

        const useCase = new UpdateServiceProvider(repository, hashService, findFileById, findJobAreaById);

        await expect(useCase.execute(dto, who)).rejects.toThrow('Job area not found');
    });
})