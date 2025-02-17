
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider, { JobMode } from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import HashService from "../../../infrastructure/services/hash-service";
import LoginServiceProvider from "./login-service-provider";
import File from "../../../domain/entities/file";
import JobArea from "../../../domain/entities/job-area";
import Address from "../../../domain/entities/address";

describe("[Use Case] Login Service Provider", () => {
    const serviceProviderExpected = new ServiceProvider(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        [new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone')],
        'Test description',
        new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', '1'),
        JobMode.ONSITE,
        [new Address('cep', 'city', 'state', 'uf', 1)],
        new JobArea('Test Job Area', 1),
    );

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new ServiceProviderRepository(prisma);
    const hashService = new HashService();

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return service provider after success login", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(serviceProviderExpected);

        const useCase = new LoginServiceProvider(repository, hashService);

        sandbox.stub(hashService, 'compare').returns(true);

        const response = await useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if service provider not found", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(null);

        const useCase = new LoginServiceProvider(repository, hashService);

        await expect(useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password)).rejects.toThrow('Invalid email or password');
    });

    test("Throw error if password is invalid", async () => {
        sandbox.stub(repository, 'findByEmail').resolves(serviceProviderExpected);

        const useCase = new LoginServiceProvider(repository, hashService);

        sandbox.stub(hashService, 'compare').returns(false);

        await expect(useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password)).rejects.toThrow('Invalid email or password');
    });
})