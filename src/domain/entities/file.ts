import CryptService from "../../infrastructure/services/crypt-service";
import ICryptService from "../../interfaces/services/crypt-service";

class File {
    constructor(
        private _originalName: string,
        private _encoding: string,
        private _mimeType: string,
        private _blobName: string,
        private _originalSize: number,
        private _compressedSize: number,
        private _url: string,
        private _id: string,
        private _cryptService: ICryptService = new CryptService(),
    ) {
    }

    public get originalName(): string {
      return this._originalName;
    }

    public get decryptedOriginalName(): string {
      return this._cryptService.decrypt(this._originalName);
    }

    public get encoding(): string {
      return this._encoding;
    }

    public get mimeType(): string {
      return this._mimeType;
    }

    public get blobName(): string {
      return this._blobName;
    }

    public get decryptedBlobName(): string {
      return this._cryptService.decrypt(this._blobName);
    }

    public get originalSize(): number {
      return this._originalSize;
    }

    public get compressedSize(): number {
      return this._compressedSize;
    }

    public get url(): string {
      return this._url;
    }

    public get decryptedUrl(): string {
      return this._cryptService.decrypt(this._url);
    }

    public get id(): string {
      return this._id;
    }

    public toJson = () => ({
      id: this.id,
      originalName: this.decryptedOriginalName,
      encoding: this.encoding,
      mimeType: this.mimeType,
      blobName: this.decryptedBlobName,
      originalSize: this.originalSize,
      compressedSize: this.compressedSize,
      url: this.decryptedUrl,
    });

    public toSimpleJson = () => ({
      id: this.id,
      originalName: this.decryptedOriginalName,
      mimeType: this.mimeType,
      size: this.compressedSize,
      url: this.decryptedUrl,
    });
  }
  
export default File;