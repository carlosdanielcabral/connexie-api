import { Request, Response } from "express";
import RegisterServiceProvider from "../../../application/use-cases/service-provider/register-service-provider";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import CryptService from "../../services/crypt-service";

class ServiceProviderController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _cryptService: CryptService = new CryptService(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterServiceProviderDTO = req.body.dto;

        const useCase = new RegisterServiceProvider(this._repository, this._cryptService);
        const provider = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/service-provider/${provider.id}`)
            .json(provider.toJson())
    }
}

export default ServiceProviderController;
