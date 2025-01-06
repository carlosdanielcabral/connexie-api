import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import IFileRepository from "../../../interfaces/repositories/file-repository";
import FileRepository from "../../database/repositories/file-repository";
import RegisterFile from "../../../application/use-cases/file/register-file";
import ICryptService from "../../../interfaces/services/crypt-service";
import CryptService from "../../services/crypt-service";
import IFileService from "../../../interfaces/services/file-service";
import FileService from "../../services/file-service";
import RegisterFileDTO from "../../../application/dtos/file/register-file";

class FileController {
    constructor(
        private readonly _repository: IFileRepository = new FileRepository(),
        private readonly _fileService: IFileService = new FileService(),
        private readonly _cryptService: ICryptService = new CryptService(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterFileDTO = req.body.dto;

        const useCase = new RegisterFile(this._repository, this._fileService, this._cryptService);
        const file = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/file/${file.id}`)
            .json({ file: file.toSimpleJson() });
    }
}

export default FileController;
