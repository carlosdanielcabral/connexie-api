import { Request, Response } from "express";
import RegisterServiceProvider from "../../../application/use-cases/service-provider/register-service-provider";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import CryptService from "../../services/crypt-service";
import LoginServiceProvider from "../../../application/use-cases/service-provider/login-service-provider";
import TokenService from "../../services/token-service";
import FileService from "../../services/file-service";

class ServiceProviderController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _cryptService: CryptService = new CryptService(),
        private readonly _tokenService: TokenService = new TokenService(),
        private readonly _fileService: FileService = new FileService(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterServiceProviderDTO = req.body.dto;

        const useCase = new RegisterServiceProvider(this._repository, this._cryptService, this._fileService);
        const provider = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/service-provider/${provider.id}`)
            .json(provider.toJson())
    }

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const useCase = new LoginServiceProvider(this._repository, this._cryptService);
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
