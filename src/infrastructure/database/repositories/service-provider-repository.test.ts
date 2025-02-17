
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import ServiceProviderRepository from "./service-provider-repository";
import ServiceProvider, { JobMode } from "../../../domain/entities/service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";
import File from "../../../domain/entities/file";
import JobArea from "../../../domain/entities/job-area";
import Address from "../../../domain/entities/address";

describe("[Repository] Service Provider", () => {
    const file = new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', 'uuid');
    const contacts = [new ServiceProviderContact('test-email', 'test-phone', 'test-cellphone')];

    const serviceProviderMock = new ServiceProvider(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        contacts,
        'Test description',
        file,
        JobMode.ONSITE,
        [new Address('cep', 'city', 'state', 'uf', 1)],
        new JobArea('Test Job Area', 1),
    );

    const prisma = new PrismaClient();

    describe("01. Create", () => {
        test("Return service provider after success insertion", async () => {
            Sinon.stub(prisma, 'user').value({
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
                    profileImage: {
                        originalName: 'original-name',
                        encoding: 'encoding',
                        mimeType: 'mimeType',
                        blobName: 'blobName',
                        originalSize: 1,
                        url: 'url',
                        compressedSize: 0,
                        id: 'uuid',
                    },
                    JobMode: serviceProviderMock.jobMode,
                    addresses: [
                        {
                            address: {
                                cep: 'cep',
                                city: 'city',
                                state: 'state',
                                uf: 'uf',
                                id: 1,
                            }
                        },
                    ],
                    jobArea: {
                        title: 'Test Job Area',
                        id: 1,
                    },
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
            Sinon.stub(prisma, 'user').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findByEmail(serviceProviderMock.email);

            expect(response).toBeNull();
        });

        test("Return service provider after success search", async () => {
            Sinon.stub(prisma, 'user').value({
                findUnique: Sinon.stub().resolves({
                    name: serviceProviderMock.name,
                    email: serviceProviderMock.email,
                    password: serviceProviderMock.password,
                    profileImage: {
                        originalName: 'original-name',
                        encoding: 'encoding',
                        mimeType: 'mimeType',
                        blobName: 'blobName',
                        originalSize: 1,
                        url: 'url',
                        compressedSize: 0,
                        id: 'uuid',
                    },
                    id: serviceProviderMock.id,
                    serviceProvider: [{
                        contact: [
                            {
                                email: serviceProviderMock.contacts[0].email,
                                phone: serviceProviderMock.contacts[0].phone,
                                cellphone: serviceProviderMock.contacts[0].cellphone,
                            },
                        ],
                        description: serviceProviderMock.description,
                        jobMode: serviceProviderMock.jobMode,
                        addresses: [
                            {
                                address: {
                                    cep: 'cep',
                                    city: 'city',
                                    state: 'state',
                                    uf: 'uf',
                                    id: 1,
                                }
                            },
                        ],
                        jobArea: {
                            title: 'Test Job Area',
                            id: 1,
                        },
                    }]
                }),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findByEmail(serviceProviderMock.email);

            expect(JSON.stringify(response)).toBe(JSON.stringify(serviceProviderMock));
        });
    });

    describe("03. List", () => {
        test("Return service providers after success search", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                findMany: Sinon.stub().resolves([
                    {
                        user: {
                            name: serviceProviderMock.name,
                            email: serviceProviderMock.email,
                            password: serviceProviderMock.password,
                            profileImage: {
                                originalName: 'original-name',
                                encoding: 'encoding',
                                mimeType: 'mimeType',
                                blobName: 'blobName',
                                originalSize: 1,
                                url: 'url',
                                compressedSize: 0,
                                id: 'uuid',
                            },
                        },
                        id: serviceProviderMock.id,
                        contact: [
                            {
                                email: serviceProviderMock.contacts[0].email,
                                phone: serviceProviderMock.contacts[0].phone,
                                cellphone: serviceProviderMock.contacts[0].cellphone,
                            },
                        ],
                        description: serviceProviderMock.description,
                        jobMode: serviceProviderMock.jobMode,
                        addresses: [
                            {
                                address: {
                                    cep: 'cep',
                                    city: 'city',
                                    state: 'state',
                                    uf: 'uf',
                                    id: 1,
                                }
                            },
                        ],
                        jobArea: {
                            title: 'Test Job Area',
                            id: 1,
                        },
                    },
                ]),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.list();

            expect(JSON.stringify(response)).toBe(JSON.stringify([serviceProviderMock]));
        });

        test("Return empty array if no service provider found", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                findMany: Sinon.stub().resolves([]),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.list();

            expect(response).toStrictEqual([]);
        });
    });

    describe("04. Count", () => {
        test("Return number of service providers", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                count: Sinon.stub().resolves(1),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.count();

            expect(response).toBe(1);
        });

        test("Return 0 if no service provider found", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                count: Sinon.stub().resolves(0),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.count();

            expect(response).toBe(0);
        });
    });

    describe("05. Update", () => {
        test("Return service provider after success update", async () => {
            Sinon.stub(prisma, 'serviceProviderAddress').value({
                deleteMany: Sinon.stub().resolves(),
            });

            Sinon.stub(prisma, 'serviceProviderContact').value({
                deleteMany: Sinon.stub().resolves(),
            });

            Sinon.stub(prisma, 'user').value({
                update: Sinon.stub().resolves({
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
                        originalSize: 1,
                        url: 'url',
                        compressedSize: 0,
                        id: 'uuid',
                    },
                    jobMode: serviceProviderMock.jobMode,
                    addresses: [
                        {
                            address: {
                                cep: 'cep',
                                city: 'city',
                                state: 'state',
                                uf: 'uf',
                                id: 1,
                            }
                        },
                    ],
                    jobArea: {
                        title: 'Test Job Area',
                        id: 1,
                    },
                }),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.update(serviceProviderMock);

            expect(response).toBe(serviceProviderMock);
        });
    });

    describe("06. Find by id", () => {
        test("Return service provider after success search", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                findUnique: Sinon.stub().resolves({
                    user: {
                        name: serviceProviderMock.name,
                        email: serviceProviderMock.email,
                        password: serviceProviderMock.password,
                        profileImage: {
                            originalName: 'original-name',
                            encoding: 'encoding',
                            mimeType: 'mimeType',
                            blobName: 'blobName',
                            originalSize: 1,
                            url: 'url',
                            compressedSize: 0,
                            id: 'uuid',
                        },
                    },
                    id: serviceProviderMock.id,
                    contact: [
                        {
                            email: serviceProviderMock.contacts[0].email,
                            phone: serviceProviderMock.contacts[0].phone,
                            cellphone: serviceProviderMock.contacts[0].cellphone,
                        },
                    ],
                    description: serviceProviderMock.description,
                    jobMode: serviceProviderMock.jobMode,
                    addresses: [
                        {
                            address: {
                                cep: 'cep',
                                city: 'city',
                                state: 'state',
                                uf: 'uf',
                                id: 1,
                            }
                        },
                    ],
                    jobArea: {
                        title: 'Test Job Area',
                        id: 1,
                    },
                }),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findById(serviceProviderMock.id);

            expect(JSON.stringify(response)).toBe(JSON.stringify(serviceProviderMock));
        });

        test("Return null if service provider not found", async () => {
            Sinon.stub(prisma, 'serviceProvider').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new ServiceProviderRepository(prisma);

            const response = await repository.findById(serviceProviderMock.id);

            expect(response).toBeNull();
        });
    });
})