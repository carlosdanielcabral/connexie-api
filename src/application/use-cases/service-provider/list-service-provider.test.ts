
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider, { JobMode } from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import ListServiceProvider from "./list-service-provider";
import File from "../../../domain/entities/file";
import JobArea from "../../../domain/entities/job-area";
import Address from "../../../domain/entities/address";

describe("[Use Case] List Service Provider", () => {
    const serviceProvidersExpected = [
        new ServiceProvider(
            'test-id-01',
            'Test Name',
            'test@email.com',
            'test-password',
            [new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone')],
            'Test description',
            new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', '1'),
            JobMode.REMOTE,
            [],
            new JobArea('Test Job Area', 1),
        ),

        new ServiceProvider(
            'test-id-02',
            'Test Name',
            'test02@email.com',
            'test-password',
            [new ServiceProviderContact('test-email-02', 'test-phone-02', 'test-cellphone-02')],
            'Test 02 description',
            new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', '1'),
            JobMode.BOTH,
            [new Address('cep', 'city', 'state', 'uf', 1)],
            new JobArea('Test Job Area', 1),
        ),
    ]

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new ServiceProviderRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return service providers", async () => {
        sandbox.stub(repository, 'list').returns(Promise.resolve(serviceProvidersExpected));

        const useCase = new ListServiceProvider(repository);

        const response = await useCase.execute({ page: 1, limit: 10 });

        expect(response).toBe(serviceProvidersExpected);
    });

    test("Return empty array when service providers not found", async () => {
        sandbox.stub(repository, 'list').returns(Promise.resolve([]));

        const useCase = new ListServiceProvider(repository);

        const response = await useCase.execute({ page: 1, limit: 10 });

        expect(response).toEqual([]);
    });
})