import FileStorage from "../../interfaces/storage/file-storage";
import AzureBlobStorageAdapter from "../storage/azure-blob-storage-adapter";

class FileService {
  constructor(private storage: FileStorage = new AzureBlobStorageAdapter()) {}

  public save = async (filename: string, content: Buffer): Promise<void> => {
    await this.storage.uploadFile(filename, content);
  }
}

export default FileService;
