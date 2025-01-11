
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import CountServiceProvider from "./count-service-provider";

describe("[Use Case] Count Service Provider", () => {
    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new ServiceProviderRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return a number greater than 0 when has more than 1 service providers", async () => {
        sandbox.stub(repository, 'count').resolves(1);

        const useCase = new CountServiceProvider(repository);

        const response = await useCase.execute();

        expect(response).toBe(1);
    });

    test("Return 0 when has no sevice providers", async () => {
        sandbox.stub(repository, 'count').resolves(0);
      
        const useCase = new CountServiceProvider(repository);

        const response = await useCase.execute();

        expect(response).toBe(0);
    });
})