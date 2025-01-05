import FileStorage from "../../interfaces/storage/file-storage";
import AzureBlobStorageAdapter from "../storage/azure-blob-storage-adapter";

class FileService {
  constructor(private storage: FileStorage = new AzureBlobStorageAdapter()) {}

  public save = async (filename: string, content: Buffer): Promise<string> => {
    const blobName = this.generateBlobName(filename);

    await this.storage.uploadFile(blobName, content);

    return blobName;
  }

  public generateBlobName = (filename: string): string => {
    const normalizedName = filename.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    return `${normalizedName}_${new Date().getTime()}`; 
  }
}

export default FileService;
