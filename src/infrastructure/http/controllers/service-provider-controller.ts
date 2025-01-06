import { Request, Response } from "express";
import RegisterServiceProvider from "../../../application/use-cases/service-provider/register-service-provider";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import LoginServiceProvider from "../../../application/use-cases/service-provider/login-service-provider";
import IFileRepository from "../../../interfaces/repositories/file-repository";
import FileRepository from "../../database/repositories/file-repository";
import ICryptService from "../../../interfaces/services/crypt-service";
import CryptService from "../../services/crypt-service";
import ITokenService from "../../../interfaces/services/token-service";
import TokenService from "../../services/token-service";
import IFileService from "../../../interfaces/services/file-service";
import FileService from "../../services/file-service";
import IHashService from "../../../interfaces/services/hash-service";
import HashService from "../../services/hash-service";
import FindFileById from "../../../application/use-cases/file/find-file-by-id";
import ListServiceProvider from "../../../application/use-cases/service-provider/list-service-provider";

class ServiceProviderController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _hashService: IHashService = new HashService(),
        private readonly _tokenService: ITokenService = new TokenService(),
        private readonly _fileService: IFileService = new FileService(),
        private readonly _fileRepository: IFileRepository = new FileRepository(),
        private readonly _cryptService: ICryptService = new CryptService(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterServiceProviderDTO = req.body.dto;

        const findFileById = new FindFileById(this._fileRepository);
        const useCase = new RegisterServiceProvider(this._repository, this._hashService, findFileById);
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
        const { filter } = req.body;

        const useCase = new ListServiceProvider(this._repository);

        const providers = await useCase.execute(filter);

        return res.status(HttpStatusCode.Ok).json({ providers: providers.map((provider) => provider.toJson()) });
    }
}

export default ServiceProviderController;
