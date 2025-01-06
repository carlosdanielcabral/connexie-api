import { PrismaClient } from '@prisma/client';
import IFileRepository from '../../../interfaces/repositories/file-repository';
import File from '../../../domain/entities/file';

class FileRepository implements IFileRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public create = async (file: File): Promise<File> => {
    await this.prisma.file.create({
      data: {
        originalName: file.originalName,
        encoding: file.encoding,
        mimeType: file.mimeType,
        blobName: file.blobName,
        originalSize: file.originalSize,
        compressedSize: file.compressedSize,
        url: file.url,
      },
    });

    return file;
  }
}

export default FileRepository;