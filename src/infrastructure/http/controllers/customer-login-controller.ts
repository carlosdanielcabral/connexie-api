import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import ITokenService from "../../../interfaces/services/token-service";
import TokenService from "../../services/token-service";
import IHashService from "../../../interfaces/services/hash-service";
import HashService from "../../services/hash-service";
import ICustomerRepository from "../../../interfaces/repositories/customer-repository";
import CustomerRepository from "../../database/repositories/customer-repository";
import LoginCustomer from "../../../application/use-cases/customer/login-customer";

class CustomerLoginController {
    constructor(
        private readonly _repository: ICustomerRepository = new CustomerRepository(),
        private readonly _hashService: IHashService = new HashService(),
        private readonly _tokenService: ITokenService = new TokenService(),
    ) {}

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const useCase = new LoginCustomer(this._repository, this._hashService);
        const customer = (await useCase.execute(email, password)).toJson();

        const token = this._tokenService.generate(customer);

        return res.status(HttpStatusCode.Ok).json({ token, customer });
    }
}

export default CustomerLoginController;
