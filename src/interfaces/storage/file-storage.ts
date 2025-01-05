interface FileStorage {
    uploadFile(filename: string, content: Buffer): Promise<boolean>;
}

export default FileStorage;
