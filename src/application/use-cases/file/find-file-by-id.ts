import File from '../../../domain/entities/file';
import FileRepository from '../../../interfaces/repositories/file-repository';

class FindFileById {
  constructor(
    private _fileRepository: FileRepository,
  ) {}

  public execute = async (id: string): Promise<File | null> => {
    return this._fileRepository.findById(id);
  };
}

export default FindFileById;