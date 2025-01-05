import { randomUUID } from "crypto";
import FileStorage from "../../interfaces/storage/file-storage";
import AzureBlobStorageAdapter from "../storage/azure-blob-storage-adapter";
import sharp from "sharp";

class FileService {
  constructor(private storage: FileStorage = new AzureBlobStorageAdapter()) {}

  public save = async (filename: string, content: Buffer): Promise<string> => {
    await this.storage.uploadFile(filename, await this.compress(content));

    return filename;
  }

  private compress = async (content: Buffer): Promise<Buffer> => {
    return sharp(content).webp().toBuffer();
  }
}

export default FileService;
