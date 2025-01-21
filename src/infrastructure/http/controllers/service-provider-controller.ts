import { Request, Response } from "express";
import RegisterServiceProvider from "../../../application/use-cases/service-provider/register-service-provider";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import IFileRepository from "../../../interfaces/repositories/file-repository";
import FileRepository from "../../database/repositories/file-repository";
import ITokenService from "../../../interfaces/services/token-service";
import TokenService from "../../services/token-service";
import IHashService from "../../../interfaces/services/hash-service";
import HashService from "../../services/hash-service";
import FindFileById from "../../../application/use-cases/file/find-file-by-id";
import ListServiceProvider from "../../../application/use-cases/service-provider/list-service-provider";
import FindJobAreaById from "../../../application/use-cases/job-area/find-job-area-by-id";
import IJobAreaRepository from "../../../interfaces/repositories/job-area-repository";
import JobAreaRepository from "../../database/repositories/job-area-repository";
import CountServiceProvider from "../../../application/use-cases/service-provider/count-service-provider";
import UpdateServiceProvider from "../../../application/use-cases/service-provider/update-service-provider";

class ServiceProviderController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _hashService: IHashService = new HashService(),
        private readonly _tokenService: ITokenService = new TokenService(),
        private readonly _fileRepository: IFileRepository = new FileRepository(),
        private readonly _jobAreaRepository: IJobAreaRepository = new JobAreaRepository(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterServiceProviderDTO = req.body.dto;

        const findFileById = new FindFileById(this._fileRepository);
        const findJobAreaById = new FindJobAreaById(this._jobAreaRepository);

        const useCase = new RegisterServiceProvider(this._repository, this._hashService, findFileById, findJobAreaById);
        const provider = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/service-provider/${provider.id}`)
            .json(provider.toJson())
    }

    public list = async (req: Request, res: Response) => {
        const { filter } = req.body;

        const useCase = new ListServiceProvider(this._repository);
        const countUseCase = new CountServiceProvider(this._repository);

        const providers = await useCase.execute(filter);
        const total = await countUseCase.execute();

        return res.status(HttpStatusCode.Ok).json({ total, providers: providers.map((provider) => provider.toPublicJson()) });
    }

    public update = async (req: Request, res: Response) => {
        const { dto, user } = req.body;

        const findFileById = new FindFileById(this._fileRepository);
        const findJobAreaById = new FindJobAreaById(this._jobAreaRepository);

        const useCase = new UpdateServiceProvider(this._repository, this._hashService, findFileById, findJobAreaById);
        const provider = await useCase.execute(dto, user);

        return res.status(HttpStatusCode.Ok).json({ provider: provider.toJson() });
    };
}

export default ServiceProviderController;
