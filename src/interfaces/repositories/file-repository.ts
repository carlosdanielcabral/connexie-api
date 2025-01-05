import File from "../../domain/entities/file";

interface FileRepository {
    create(file: File): Promise<File>;
}

export default FileRepository;
