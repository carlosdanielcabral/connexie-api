
import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import Sinon from "sinon";
import AzureBlobStorageAdapter from "./azure-blob-storage-adapter";
import ExternalServiceError from "../../application/errors/external-service-error";

describe("[Storage] Azure Blob Storage Adapter", () => {
    const blobClient = Sinon.createStubInstance(BlobServiceClient);
    const containerClient = Sinon.createStubInstance(ContainerClient);
    const blockClient = Sinon.createStubInstance(BlockBlobClient);

    describe("01. Upload", () => {
        test("Return 'true' after success insertion", async () => {
            const successfullResponse = new Promise<BlockBlobUploadResponse>(() => ({
                _response: {
                    status: 201,
                }
            }));

            blockClient.upload.returns(successfullResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const adapter = new AzureBlobStorageAdapter(blobClient);

            const response = await adapter.uploadFile('test-filename', new Buffer('test'));

            expect(response).toBe(true);
        });

        test("Throw an exception after failed insertion", async () => {
            const errorResponse = new Promise<BlockBlobUploadResponse>(() => ({
                _response: {
                    status: 500,
                }
            }));

            blockClient.upload.returns(errorResponse);
            containerClient.getBlockBlobClient.returns(blockClient);
            blobClient.getContainerClient.returns(containerClient);

            const adapter = new AzureBlobStorageAdapter(blobClient);

            try {
                await adapter.uploadFile('test-filename', new Buffer('test'));
            } catch (error) {
                expect(error).toBeInstanceOf(ExternalServiceError);
            }
        });
    });
})