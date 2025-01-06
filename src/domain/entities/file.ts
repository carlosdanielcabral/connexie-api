
class File {
    constructor(
        public originalName: string,
        public encoding: string,
        public mimeType: string,
        public blobName: string,
        public originalSize: number,
        public compressedSize: number,
        public url: string,
        public id?: number,
    ) {
    }

    public toJson = () => ({
      id: this.id,
      originalName: this.originalName,
      encoding: this.encoding,
      mimeType: this.mimeType,
      blobName: this.blobName,
      size: this.compressedSize,
    });

    public toSimpleJson = () => ({
      originalName: this.originalName,
      encoding: this.encoding,
      mimeType: this.mimeType,
      blobName: this.blobName,
      size: this.compressedSize,
    });
  }
  
export default File;