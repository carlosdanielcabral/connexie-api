
import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import Sinon, { SinonStubbedInstance } from "sinon";
import AzureBlobStorageAdapter from "./azure-blob-storage-adapter";
import ExternalServiceError from "../../application/errors/external-service-error";

describe("[Storage] Azure Blob Storage Adapter", () => {
    describe("01. Upload", () => {
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

        test("Return 'true' after success insertion", async () => {
            const successfullResponse = new Promise<BlockBlobUploadResponse>((resolve) => {
                resolve({
                    _response: {
                        status: 201,
                    }
                } as BlockBlobUploadResponse);
            });

            blockClient.upload.returns(successfullResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const adapter = new AzureBlobStorageAdapter(blobClient);

            const response = await adapter.uploadFile('test-filename', new Buffer('test'));

            expect(response).toBe(true);
        });

        test("Throw an exception after failed insertion", async () => {
            const errorResponse = new Promise<BlockBlobUploadResponse>((resolve) => {
                resolve({
                    _response: {
                        status: 500,
                    }
                } as BlockBlobUploadResponse);
            });

            blockClient.upload.returns(errorResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const adapter = new AzureBlobStorageAdapter(blobClient);

            try {
                await adapter.uploadFile('test-filename', Buffer.from('test'));
            } catch (error) {
                expect(error).toBeInstanceOf(ExternalServiceError);
            }
        });
    });
})