
import { PrismaClient } from "@prisma/client";
import Sinon, { SinonStubbedInstance } from "sinon";
import HashService from "../../../infrastructure/services/hash-service";
import File from "../../../domain/entities/file";
import FileService from "../../../infrastructure/services/file-service";
import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import AzureBlobStorageAdapter from "../../../infrastructure/storage/azure-blob-storage-adapter";
import fs from 'fs/promises';
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import RegisterFileDTO from "../../dtos/file/register-file";
import RegisterFile from "./register-file";
import CryptService from "../../../infrastructure/services/crypt-service";

describe("[Use Case] Register File", () => {
    const file = new File('encrypted', 'encoding', 'mimeType', 'encrypted', 1, 0, 'encrypted', 'uuid');

    const dto = new RegisterFileDTO('uuid', 'original-name', 'encoding', 'mimeType', 1, 'tempPath');

    const prisma = Sinon.createStubInstance(PrismaClient);

    const repository = new FileRepository(prisma);
    const hashService = new HashService();

    let blobClient: SinonStubbedInstance<BlobServiceClient>;
    let containerClient: SinonStubbedInstance<ContainerClient>;
    let blockClient: SinonStubbedInstance<BlockBlobClient>

    let storageAdapater: AzureBlobStorageAdapter;
    let fileService: FileService;

    const sandbox = Sinon.createSandbox();

    const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

    beforeEach(() => {
        const successfullResponse = {
            _response: { status: 201 }
        } as BlockBlobUploadResponse;

        blobClient = Sinon.createStubInstance(BlobServiceClient);
        containerClient = Sinon.createStubInstance(ContainerClient);
        blockClient = Sinon.createStubInstance(BlockBlobClient);

        blockClient.upload.resolves(successfullResponse);
        containerClient.getBlockBlobClient.returns(blockClient);
        blobClient.getContainerClient.returns(containerClient);

        storageAdapater = new AzureBlobStorageAdapter(blobClient);

        fileService = new FileService(storageAdapater);

        sandbox.stub(hashService, 'hash').returns('test-id');
        sandbox.stub(fileService, 'save').resolves('blobName');
        sandbox.stub(fs, 'readFile').resolves(new Buffer('test'));
        sandbox.stub(fileService, 'compress').resolves(Buffer.from('test'));
        sandbox.stub(cryptService, 'encrypt').returns('encrypted');
    });

    afterEach(() => {
        sandbox.restore();

        blockClient.upload.restore();
        containerClient.getBlockBlobClient.restore();
        blobClient.getContainerClient.restore();
    });

    test("Return file after success insertion", async () => {
        sandbox.stub(repository, 'create').resolves(file);

        const useCase = new RegisterFile(repository, fileService, cryptService);

        const response = await useCase.execute(dto);

        expect(response).toBe(file);
    });
})