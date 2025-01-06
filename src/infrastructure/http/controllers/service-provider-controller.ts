import { Request, Response } from "express";
import RegisterServiceProvider from "../../../application/use-cases/service-provider/register-service-provider";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import HashService from "../../services/hash-service";
import LoginServiceProvider from "../../../application/use-cases/service-provider/login-service-provider";
import TokenService from "../../services/token-service";
import FileService from "../../services/file-service";
import IFileRepository from "../../../interfaces/repositories/file-repository";
import FileRepository from "../../database/repositories/file-repository";
import RegisterFile from "../../../application/use-cases/file/register-file";
import ICryptService from "../../../interfaces/services/crypt-service";
import CryptService from "../../services/crypt-service";

class ServiceProviderController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _hashService: HashService = new HashService(),
        private readonly _tokenService: TokenService = new TokenService(),
        private readonly _fileService: FileService = new FileService(),
        private readonly _fileRepository: IFileRepository = new FileRepository(),
        private readonly _cryptService: ICryptService = new CryptService(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterServiceProviderDTO = req.body.dto;

        const registerFile = new RegisterFile(this._fileRepository, this._fileService, this._cryptService);
        const useCase = new RegisterServiceProvider(this._repository, this._hashService, registerFile);
        const provider = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/service-provider/${provider.id}`)
            .json(provider.toJson())
    }

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const useCase = new LoginServiceProvider(this._repository, this._hashService);
        const provider = (await useCase.execute(email, password)).toJson();

        const token = this._tokenService.generate(provider);

        return res.status(HttpStatusCode.Ok).json({ token, provider });
    }

    public list = async (req: Request, res: Response) => {
        const providers = await this._repository.list();

        return res.status(HttpStatusCode.Ok).json({ providers: providers.map((provider) => provider.toJson()) });
    }
}

export default ServiceProviderController;
