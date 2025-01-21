import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import ServiceProviderRepository from "../../database/repositories/service-provider-repository";
import LoginServiceProvider from "../../../application/use-cases/service-provider/login-service-provider";
import ITokenService from "../../../interfaces/services/token-service";
import TokenService from "../../services/token-service";
import IHashService from "../../../interfaces/services/hash-service";
import HashService from "../../services/hash-service";

class ServiceProviderLoginController {
    constructor(
        private readonly _repository: ServiceProviderRepository = new ServiceProviderRepository(),
        private readonly _hashService: IHashService = new HashService(),
        private readonly _tokenService: ITokenService = new TokenService(),
    ) {}

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const useCase = new LoginServiceProvider(this._repository, this._hashService);
        const provider = (await useCase.execute(email, password)).toJson();

        const token = this._tokenService.generate(provider);

        return res.status(HttpStatusCode.Ok).json({ token, provider });
    }
}

export default ServiceProviderLoginController;
