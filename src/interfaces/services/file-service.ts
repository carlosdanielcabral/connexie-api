interface FileService {
    save(filename: string, content: Buffer): Promise<string>;
    compress(content: Buffer): Promise<Buffer>;
    generateBlobName(): string;
    generateUrlBasedOnBlobName(blobName: string): string;
}

export default FileService;
