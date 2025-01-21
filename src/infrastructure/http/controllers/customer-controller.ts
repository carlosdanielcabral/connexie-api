import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import IFileRepository from "../../../interfaces/repositories/file-repository";
import FileRepository from "../../database/repositories/file-repository";
import ITokenService from "../../../interfaces/services/token-service";
import TokenService from "../../services/token-service";
import IHashService from "../../../interfaces/services/hash-service";
import HashService from "../../services/hash-service";
import FindFileById from "../../../application/use-cases/file/find-file-by-id";
import ICustomerRepository from "../../../interfaces/repositories/customer-repository";
import CustomerRepository from "../../database/repositories/customer-repository";
import RegisterCustomerDTO from "../../../application/dtos/customer/register-customer";
import RegisterCustomer from "../../../application/use-cases/customer/register-customer";

class CustomerController {
    constructor(
        private readonly _repository: ICustomerRepository = new CustomerRepository(),
        private readonly _hashService: IHashService = new HashService(),
        private readonly _tokenService: ITokenService = new TokenService(),
        private readonly _fileRepository: IFileRepository = new FileRepository(),
    ) {}

    public create = async (req: Request, res: Response) => {
        const dto: RegisterCustomerDTO = req.body.dto;

        const findFileById = new FindFileById(this._fileRepository);

        const useCase = new RegisterCustomer(this._repository, this._hashService, findFileById);
        const customer = await useCase.execute(dto);

        return res
            .status(HttpStatusCode.Created)
            .location(`/customer/${customer.id}`)
            .json(customer.toJson())
    }
}

export default CustomerController;
