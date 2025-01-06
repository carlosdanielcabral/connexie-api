import File from "../../domain/entities/file";

interface FileRepository {
    create(file: File): Promise<File>;
    findById(id: string): Promise<File | null>;
}

export default FileRepository;
