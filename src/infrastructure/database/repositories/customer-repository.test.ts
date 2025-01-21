
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import File from "../../../domain/entities/file";
import Customer from "../../../domain/entities/customer";
import CustomerRepository from "./customer-repository";

describe("[Repository] Customer", () => {
    const file = new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', 'uuid');

    const customerMock = new Customer(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        file,
    );

    const prisma = new PrismaClient();

    describe("01. Create", () => {
        test("Return customer after success insertion", async () => {
            Sinon.stub(prisma, 'customer').value({
                create: Sinon.stub().resolves({
                    id: customerMock.id,
                    name: customerMock.name,
                    email: customerMock.email,
                    password: customerMock.password,
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
                }),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.create(customerMock);

            expect(response).toBe(customerMock);
        });
    });

    describe("02. Find by email", () => {
        afterEach(() => {
            Sinon.stub(prisma, 'customer').restore();
        });

        test("Return null if customer not found", async () => {           
            Sinon.stub(prisma, 'customer').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.findByEmail(customerMock.email);

            expect(response).toBeNull();
        });

        test("Return customer after success search", async () => {
            Sinon.stub(prisma, 'customer').value({
                findUnique: Sinon.stub().resolves({
                    id: customerMock.id,
                    name: customerMock.name,
                    email: customerMock.email,
                    password: customerMock.password,
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
                }),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.findByEmail(customerMock.email);

            expect(JSON.stringify(response)).toBe(JSON.stringify(customerMock));
        });
    });

    describe("03. Update", () => {
        test("Return customer after success update", async () => {
            Sinon.stub(prisma, 'customer').value({
                update: Sinon.stub().resolves({
                    id: customerMock.id,
                    name: customerMock.name,
                    email: customerMock.email,
                    password: customerMock.password,
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
                }),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.update(customerMock);

            expect(response).toBe(customerMock);
        });
    });

    describe("04. Find by id", () => {
        test("Return customer after success search", async () => {
            Sinon.stub(prisma, 'customer').value({
                findUnique: Sinon.stub().resolves({
                    id: customerMock.id,
                    name: customerMock.name,
                    email: customerMock.email,
                    password: customerMock.password,
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
                }),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.findById(customerMock.id);

            expect(JSON.stringify(response)).toBe(JSON.stringify(customerMock));
        });

        test("Return null if customer not found", async () => {
            Sinon.stub(prisma, 'customer').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new CustomerRepository(prisma);

            const response = await repository.findById(customerMock.id);

            expect(response).toBeNull();
        });
    });
})