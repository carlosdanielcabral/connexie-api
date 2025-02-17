import { BlobServiceClient } from "@azure/storage-blob";
import FileStorage from "../../interfaces/storage/file-storage";
import ExternalServiceError from "../../application/errors/external-service-error";

class AzureBlobStorageAdapter implements FileStorage {
    private client;

    constructor(client?: BlobServiceClient, container?: string) {
        if (client === undefined) {
            client = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNEXION_STRING as string);
        }

        this.client = client.getContainerClient(container ?? process.env.AZURE_STORAGE_CONTAINER_NAME as string);
    }

    public uploadFile = async (blobName: string, content: Buffer): Promise<boolean> => {
        const client = this.client.getBlockBlobClient(blobName);
        
        const response = await client.upload(content, content.length);

        if (response._response.status !== 201) {
            throw new ExternalServiceError("Failed to upload file to azure storage");
        }

        return true;
    }
}

export default AzureBlobStorageAdapter;
