
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import Address from "../../../domain/entities/address";
import AddressRepository from "../../../infrastructure/database/repositories/address-repository";
import ListAddress from "./list-address";

describe("[Use Case] List Address", () => {
    const addressesExpected = [
        new Address('cep', 'city', 'state', 'uf', 1),
        new Address('cep2', 'city2', 'state2', 'uf2', 2),
    ]

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new AddressRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return addresses", async () => {
        sandbox.stub(repository, 'list').resolves(addressesExpected);

        const useCase = new ListAddress(repository);

        const response = await useCase.execute({ });

        expect(response).toBe(addressesExpected);
    });

    test("Return empty array when addresses not found", async () => {
        sandbox.stub(repository, 'list').resolves([]);

        const useCase = new ListAddress(repository);

        const response = await useCase.execute({ });

        expect(response).toEqual([]);
    });
})