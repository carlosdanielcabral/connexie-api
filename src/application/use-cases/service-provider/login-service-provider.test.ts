
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "../../../infrastructure/database/repositories/service-provider-repository";
import ServiceProvider from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import CryptService from "../../../infrastructure/services/crypt-service";
import LoginServiceProvider from "./login-service-provider";

describe("[Use Case] Login Service Provider", () => {
    const serviceProviderExpected = new ServiceProvider('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone'),
    ]);

    const prisma = new PrismaClient();
    const repository = new ServiceProviderRepository(prisma);
    const cryptService = new CryptService();

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return service provider after success login", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(serviceProviderExpected));

        const useCase = new LoginServiceProvider(repository, cryptService);

        sandbox.stub(cryptService, 'compare').returns(true);

        const response = await useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password);

        expect(response).toBe(serviceProviderExpected);
    });

    test("Throw error if service provider not found", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(null));

        const useCase = new LoginServiceProvider(repository, cryptService);

        await expect(useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password)).rejects.toThrow('Invalid email or password');
    });

    test("Throw error if password is invalid", async () => {
        sandbox.stub(repository, 'findByEmail').returns(Promise.resolve(serviceProviderExpected));

        const useCase = new LoginServiceProvider(repository, cryptService);

        sandbox.stub(cryptService, 'compare').returns(false);

        await expect(useCase.execute(serviceProviderExpected.email, serviceProviderExpected.password)).rejects.toThrow('Invalid email or password');
    });
})