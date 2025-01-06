
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
import RegisterServiceProviderImageDTO from "../../dtos/file/register-file";
import FileService from "../../../infrastructure/services/file-service";
import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import AzureBlobStorageAdapter from "../../../infrastructure/storage/azure-blob-storage-adapter";
import fs from 'fs/promises';
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import RegisterFile from "../file/register-file";
import CryptService from "../../../infrastructure/services/crypt-service";

describe("[Use Case] Register Service Provider", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 1);

    const serviceProviderExpected = new ServiceProvider('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone'),
    ], 'Test description', file);

    const dto = new RegisterServiceProviderDTO('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new RegisterServiceProviderContactDTO('test-email', 'test-phone', 'test-cellphone'),
    ], 'Test description', new RegisterServiceProviderImageDTO('original-name', 'encoding', 'mimeType', 1, 'tempPath'));

    const prisma = new PrismaClient();
    const repository = new ServiceProviderRepository(prisma);
    const hashService = new HashService();

    let blobClient: SinonStubbedInstance<BlobServiceClient>;
    let containerClient: SinonStubbedInstance<ContainerClient>;
    let blockClient: SinonStubbedInstance<BlockBlobClient>

    let storageAdapater: AzureBlobStorageAdapter;
    let fileService: FileService;
    let registerFile: RegisterFile;

    const fileRepository = new FileRepository(prisma);
    const cryptService = new CryptService();

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        const successfullResponse = new Promise<BlockBlobUploadResponse>((resolve) => {
            resolve({
                _response: {
                    status: 201,
                }
            } as BlockBlobUploadResponse);
        });

        blobClient = Sinon.createStubInstance(BlobServiceClient);
        containerClient = Sinon.createStubInstance(ContainerClient);
        blockClient = Sinon.createStubInstance(BlockBlobClient);

        blockClient.upload.returns(successfullResponse);
        containerClient.getBlockBlobClient.returns(blockClient);
        blobClient.getContainerClient.returns(containerClient);

        storageAdapater = new AzureBlobStorageAdapter(blobClient);

        fileService = new FileService(storageAdapater);

        sandbox.stub(repository, 'create').returns(Promise.resolve(serviceProviderExpected));
        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fileService, 'save').resolves('blobName');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');

        registerFile = new RegisterFile(fileRepository, fileService, new CryptService());
        sandbox.stub(registerFile, 'execute').resolves(file);
    });

    afterEach(() => {
        sandbox.restore();

        blockClient.upload.restore();
        containerClient.getBlockBlobClient.restore();
        blobClient.getContainerClient.restore();
    });

    test("Return service provider after success insertion", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(null));

        const useCase = new RegisterServiceProvider(repository, hashService, registerFile);

        const response = await useCase.execute(dto);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if email is already in use", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(serviceProviderExpected));

        const useCase = new RegisterServiceProvider(repository, hashService, registerFile);

        await expect(useCase.execute(dto)).rejects.toThrow('This email is already in use');
    });
})