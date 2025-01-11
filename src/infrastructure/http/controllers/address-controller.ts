import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import AddressRepository from "../../database/repositories/address-repository";
import ListAddress from "../../../application/use-cases/address/list-address";

class AddressController {
    constructor(
        private readonly _repository: AddressRepository = new AddressRepository(),
    ) {}

    public list = async (req: Request, res: Response) => {
        const { filter } = req.body;

        const useCase = new ListAddress(this._repository);

        const addresses = await useCase.execute(filter);

        return res.status(HttpStatusCode.Ok).json({ addresses: addresses.map((address) => address.toJson()) });
    }
}

export default AddressController;
