import ServiceProvider from '../../../domain/entities/service-provider';
import File from '../../../domain/entities/file';
import FileService from '../../../infrastructure/services/file-service';
import fs from 'fs/promises';
import RegisterFileDTO from '../../dtos/file/register-file';
import FileRepository from '../../../interfaces/repositories/file-repository';

class RegisterFile {
  constructor(
    private _fileService: FileService,
    private _fileRepository: FileRepository,
  ) {}

  public execute = async (dto: RegisterFileDTO): Promise<File> => {
    const { tempPath, originalName, encoding, mimeType } = dto;

    const fileBuffer = await fs.readFile(tempPath);
    const compressedFileBuffer = await this._fileService.compress(fileBuffer);

    const blobName = this._fileService.generateBlobName();
    const url =  this._fileService.generateUrlBasedOnBlobName(blobName);

    const originalSize = Buffer.byteLength(fileBuffer);
    const compressedSize = Buffer.byteLength(compressedFileBuffer);

    const file = new File(
        originalName,
        encoding,
        mimeType,
        blobName,
        originalSize,
        compressedSize,
        url,
    );

    await this._fileService.save(blobName, compressedFileBuffer);

    return this._fileRepository.create(file);
  };
}

export default RegisterFile;