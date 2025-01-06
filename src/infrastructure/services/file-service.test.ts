
import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import Sinon, { SinonStubbedInstance } from "sinon";
import ExternalServiceError from "../../application/errors/external-service-error";
import AzureBlobStorageAdapter from "../storage/azure-blob-storage-adapter";
import FileService from "./file-service";

describe("[Service] File Service", () => {
    describe("01. Save", () => {
        let blobClient: SinonStubbedInstance<BlobServiceClient>;
        let containerClient: SinonStubbedInstance<ContainerClient>;
        let blockClient: SinonStubbedInstance<BlockBlobClient>

        const sandbox = Sinon.createSandbox();
        
        beforeEach(() => {
            blobClient = Sinon.createStubInstance(BlobServiceClient);
            containerClient = Sinon.createStubInstance(ContainerClient);
            blockClient = Sinon.createStubInstance(BlockBlobClient);
        });

        afterEach(() => {
            sandbox.restore();

            blockClient.upload.restore();
            containerClient.getBlockBlobClient.restore();
            blobClient.getContainerClient.restore();
        });

        test("Return generated blob name after success insertion", async () => {
            const successfullResponse = {
                _response: { status: 201 }
            } as BlockBlobUploadResponse;

            blockClient.upload.resolves(successfullResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const storage = new AzureBlobStorageAdapter(blobClient);

            sandbox.stub(storage, 'uploadFile').resolves(true);

            const fileService = new FileService(storage);

            const blobName = 'test-filename';

            const response = await fileService.save('test-filename', new Buffer('test'));

            expect(response).toBe(blobName);
        });

        test("Throw an exception after failed insertion", async () => {
            const errorResponse = {
                _response: { status: 500 }
            } as BlockBlobUploadResponse;

            blockClient.upload.resolves(errorResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const storage = new AzureBlobStorageAdapter(blobClient);

            sandbox.stub(storage, 'uploadFile').throws(new ExternalServiceError('An error ocurred'));

            const fileService = new FileService(storage);

            try {
                await fileService.save('test-filename', new Buffer('test'));
            } catch (error) {
                expect(error).toBeInstanceOf(ExternalServiceError);
            }
        });
    });
})