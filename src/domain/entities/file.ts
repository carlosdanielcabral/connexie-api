
class File {
    constructor(
        public originalName: string,
        public encoding: string,
        public mimeType: string,
        public blobName: string,
        public size: number,
        public id?: number,
    ) {
    }

    public toJson = () => ({
      id: this.id,
      originalName: this.originalName,
      encoding: this.encoding,
      mimeType: this.mimeType,
      blobName: this.blobName,
      size: this.size,
    });

    public toSimpleJson = () => ({
      originalName: this.originalName,
      encoding: this.encoding,
      mimeType: this.mimeType,
      blobName: this.blobName,
      size: this.size,
    });
  }
  
export default File;