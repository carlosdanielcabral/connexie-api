
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "./service-provider-repository";
import ServiceProvider from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import File from "../../../domain/entities/file";

describe("[Repository] Service Provider", () => {
    const serviceProviderMock = new ServiceProvider('test-id', 'Test Name', 'test@email.com', 'test-password', [
        new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone'),
    ], 'Test description', new File('original-name', 'encoding', 'mimeType', 'blobName', 1));

    const prisma = new PrismaClient();

    describe("01. Create", () => {
        test("Return service provider after success insertion", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                create: Sinon.stub().resolves({
                    id: serviceProviderMock.id,
                    name: serviceProviderMock.name,
                    email: serviceProviderMock.email,
                    password: serviceProviderMock.password,
                    contact: [
                        {
                            email: serviceProviderMock.contacts[0].email,
                            phone: serviceProviderMock.contacts[0].phone,
                            cellphone: serviceProviderMock.contacts[0].cellphone,
                        },
                    ],
                    description: serviceProviderMock.description,
                }),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.create(serviceProviderMock);

            expect(response).toBe(serviceProviderMock);
        });
    });

    describe("02. Find by email", () => {
        afterEach(() => {
            Sinon.stub(prisma, 'serviceProvider').restore();
        });

        test("Return null if service provider not found", async () => {           
            Sinon.stub(prisma, 'serviceProvider').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findByEmail(serviceProviderMock.email);

            expect(response).toBeNull();
        });

        test("Return service provider after success search", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                findUnique: Sinon.stub().resolves({
                    id: serviceProviderMock.id,
                    name: serviceProviderMock.name,
                    email: serviceProviderMock.email,
                    password: serviceProviderMock.password,
                    contact: [
                        {
                            email: serviceProviderMock.contacts[0].email,
                            phone: serviceProviderMock.contacts[0].phone,
                            cellphone: serviceProviderMock.contacts[0].cellphone,
                        },
                    ],
                    description: serviceProviderMock.description,
                    profileImage: {
                        originalName: 'original-name',
                        encoding: 'encoding',
                        mimeType: 'mimeType',
                        blobName: 'blobName',
                        size: 1
                    }
                }),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findByEmail(serviceProviderMock.email);

            expect(JSON.stringify(response)).toBe(JSON.stringify(serviceProviderMock));
        });
    });
})