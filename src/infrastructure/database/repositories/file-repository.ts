import { PrismaClient } from '@prisma/client';
import IFileRepository from '../../../interfaces/repositories/file-repository';
import File from '../../../domain/entities/file';

class FileRepository implements IFileRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public create = async (file: File): Promise<File> => {
    await this.prisma.file.create({
      data: {
        id: file.id,
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

  public findById = async (id: string): Promise<File | null> => {
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file) return null;

    return new File(
      file.originalName,
      file.encoding,
      file.mimeType,
      file.blobName,
      file.originalSize,
      file.compressedSize,
      file.url,
      file.id,
    );
  }

}

export default FileRepository;