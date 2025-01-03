
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import RegisterServiceProviderDTO from "../../dtos/service-provider/register-service-provider";
import RegisterServiceProviderContactDTO from "../../dtos/service-provider/register-service-provider-contact";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import RegisterServiceProvider from "./register-service-provider";
import CryptService from "../../../infrastructure/services/crypt-service";

describe("[Use Case] Register Service Provider", () => {
    const serviceProviderExpected = new ServiceProvider('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone'),
    ], 'Test description');

    const dto = new RegisterServiceProviderDTO('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new RegisterServiceProviderContactDTO('test-email', 'test-phone', 'test-cellphone'),
    ], 'Test description');

    const prisma = new PrismaClient();
    const repository = new ServiceProviderRepository(prisma);
    const cryptService = new CryptService();

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {    
        sandbox.stub(repository, 'create').returns(Promise.resolve(serviceProviderExpected));
        sandbox.stub(cryptService, 'encrypt').returns('test-id');        
    });
    
    afterEach(() => {
        sandbox.restore();
    });

    test("Return service provider after success insertion", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(null));

        const useCase = new RegisterServiceProvider(repository, cryptService);

        const response = await useCase.execute(dto);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if email is already in use", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(serviceProviderExpected));

        const useCase = new RegisterServiceProvider(repository, cryptService);

        await expect(useCase.execute(dto)).rejects.toThrow('This email is already in use');
    });
})