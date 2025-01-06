import File from '../../../domain/entities/file';
import fs from 'fs/promises';
import RegisterFileDTO from '../../dtos/file/register-file';
import FileRepository from '../../../interfaces/repositories/file-repository';
import FileService from '../../../interfaces/services/file-service';
import CryptService from '../../../interfaces/services/crypt-service';

class RegisterFile {
  constructor(
    private _fileRepository: FileRepository,
    private _fileService: FileService,
    private _cryptService: CryptService,
  ) {}

  public execute = async (dto: RegisterFileDTO): Promise<File> => {
    const { tempPath, originalName, encoding, mimeType } = dto;

    const fileBuffer = await fs.readFile(tempPath);
    const compressedFileBuffer = await this._fileService.compress(fileBuffer);

    const blobName = this._fileService.generateBlobName();
    const url =  this._fileService.generateUrlBasedOnBlobName(blobName);

    const originalSize = Buffer.byteLength(fileBuffer);

    const file = new File(
        this._cryptService.encrypt(originalName),
        encoding,
        mimeType,
        this._cryptService.encrypt(blobName),
        originalSize,
        originalSize,
        this._cryptService.encrypt(url),
        dto.id,
    );

    await this._fileService.save(blobName, compressedFileBuffer);

    return this._fileRepository.create(file);
  };
}

export default RegisterFile;