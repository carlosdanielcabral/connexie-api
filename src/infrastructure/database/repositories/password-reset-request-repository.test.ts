
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import File from "../../../domain/entities/file";
import PasswordResetRequest from "../../../domain/entities/password-reset-request";
import PasswordResetRequestRepository from "./password-reset-request-repository";
import User from "../../../domain/entities/user";
import { create } from "node:domain";

describe("[Repository] Password reset request", () => {
    const file = new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', 'uuid');

    const userMock = new User(
        'test-id',
        'Test Name',
        'test@email.com',
        'test-password',
        file,
    );

    const prisma = new PrismaClient();
    const passwordResetRequestRepository = new PasswordResetRequestRepository(prisma);

    afterEach(() => {
        Sinon.restore();
    });

    describe("01. Create password reset request", () => {
        test("01. Return password reset request after successful insertion", async () => {
            Sinon.stub(prisma, 'userPasswordResetRequest').value({
                create: Sinon.stub().resolves({
                    token: 'test-token',
                    expiresAt: new Date('2025-01-22'),
                    usedAt: null,
                    userId: userMock.id,
                    createdAt: new Date('2025-01-22'),
                }),
            });

            const passwordResetRequest = new PasswordResetRequest(userMock, 'test-token', new Date('2025-01-22'), new Date('2025-01-22'), null);

            const result = await passwordResetRequestRepository.create(passwordResetRequest);

            expect(JSON.stringify(result)).toBe(JSON.stringify(passwordResetRequest));
        });
    });

    describe("02. Find password reset request by id", () => {
        test("01. Return null if password reset request is not found", async () => {
            Sinon.stub(prisma, 'userPasswordResetRequest').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const result = await passwordResetRequestRepository.findById(1);

            expect(result).toBeNull();
        });

        test("02. Return password reset request if found", async () => {
            Sinon.stub(prisma, 'userPasswordResetRequest').value({
                findUnique: Sinon.stub().resolves({
                    id: 1,
                    token: 'test-token',
                    expiresAt: new Date('2025-01-22'),
                    createdAt: new Date('2025-01-22'),
                    usedAt: null,
                    user: {
                        id: userMock.id,
                        name: userMock.name,
                        email: userMock.email,
                        password: userMock.password,
                        profileImage: {
                            originalName: file.originalName,
                            encoding: file.encoding,
                            mimeType: file.mimeType,
                            blobName: file.blobName,
                            originalSize: file.originalSize,
                            compressedSize: file.compressedSize,
                            url: file.url,
                            id: file.id,
                        },
                    },
                }),
            });

            const result = await passwordResetRequestRepository.findById(1);

            const passwordResetRequest = new PasswordResetRequest(
                userMock,
                'test-token',
                new Date('2025-01-22'),
                new Date('2025-01-22'),
                null,
                1,
            );

            console.log(result);
            console.log(passwordResetRequest);
            expect(JSON.stringify(result)).toBe(JSON.stringify(passwordResetRequest));
        });
    });

    describe("03. Find last password reset request by user", () => {
        test("01. Return null if password reset request is not found", async () => {
            Sinon.stub(prisma, 'userPasswordResetRequest').value({
                findFirst: Sinon.stub().resolves(null),
            });

            const result = await passwordResetRequestRepository.findLastByUser('test-id');

            expect(result).toBeNull();
        });

        test("02. Return password reset request if found", async () => {
            Sinon.stub(prisma, 'userPasswordResetRequest').value({
                findFirst: Sinon.stub().resolves({
                    id: 1,
                    token: 'test-token',
                    expiresAt: new Date('2025-01-22'),
                    usedAt: null,
                    createdAt: new Date('2025-01-22'),
                    user: {
                        id: userMock.id,
                        name: userMock.name,
                        email: userMock.email,
                        password: userMock.password,
                        profileImage: {
                            originalName: file.originalName,
                            encoding: file.encoding,
                            mimeType: file.mimeType,
                            blobName: file.blobName,
                            originalSize: file.originalSize,
                            compressedSize: file.compressedSize,
                            url: file.url,
                            id: file.id,
                        },
                    },
                }),
            });

            const result = await passwordResetRequestRepository.findLastByUser('test-id');

            const passwordResetRequest = new PasswordResetRequest(
                userMock,
                'test-token',
                new Date('2025-01-22'),
                new Date('2025-01-22'),
                null,
                1,
            );

            expect(JSON.stringify(result)).toEqual(JSON.stringify(passwordResetRequest));
        });
    });
})