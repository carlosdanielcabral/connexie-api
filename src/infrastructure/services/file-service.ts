import { randomUUID } from "crypto";
import FileStorage from "../../interfaces/storage/file-storage";
import AzureBlobStorageAdapter from "../storage/azure-blob-storage-adapter";
import sharp from "sharp";
import IFileService from "../../interfaces/services/file-service";

class FileService implements IFileService {
  constructor(private storage: FileStorage = new AzureBlobStorageAdapter()) {}

  public save = async (filename: string, content: Buffer): Promise<string> => {
    await this.storage.uploadFile(filename, content);

    return filename;
  }

  public compress = async (content: Buffer): Promise<Buffer> => {
    return sharp(content).webp().toBuffer();
  }

  public generateBlobName = (): string => {
    return randomUUID();
  }

  public generateUrlBasedOnBlobName = (blobName: string): string => {
    return `${process.env.AZURE_STORAGE_URL}/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;
  }
}

export default FileService;
