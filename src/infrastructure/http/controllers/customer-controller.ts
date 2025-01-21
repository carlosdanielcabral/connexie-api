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
import FindCustomerById from "../../../application/use-cases/customer/find-customer-by-id";
import NotFoundError from "../../../application/errors/not-found-error";
import UpdateCustomer from "../../../application/use-cases/customer/update-customer";

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

    public findById = async (req: Request, res: Response) => {
        const { id } = req.body.user;

        const useCase = new FindCustomerById(this._repository);

        const customer = await useCase.execute(id);

        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return res.status(HttpStatusCode.Ok).json({ customer: customer.toJson() });
    }

    public update = async (req: Request, res: Response) => {
        const { dto, user } = req.body;

        const findFileById = new FindFileById(this._fileRepository);
    
        const useCase = new UpdateCustomer(this._repository, this._hashService, findFileById);
        const customer = await useCase.execute(dto, user);

        return res.status(HttpStatusCode.Ok).json({ customer: customer.toJson() });
    }
}

export default CustomerController;
