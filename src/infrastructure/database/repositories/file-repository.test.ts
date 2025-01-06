
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import File from "../../../domain/entities/file";
import FileRepository from "./file-repository";

describe("[Repository] File", () => {
    const file = new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', 'uuid');

    const prisma = new PrismaClient();

    describe("01. Create", () => {
        test("Return file after success insertion", async () => {
            Sinon.stub(prisma, 'file').value({
                create: Sinon.stub().resolves({
                    id: file.id,
                    originalName: file.originalName,
                    encoding: file.encoding,
                    mimeType: file.mimeType,
                    blobName: file.blobName,
                    originalSize: file.originalSize,
                    compressedSize: file.compressedSize,
                    url: file.url,
                }),
            });

            const repository = new FileRepository(prisma);

            const response = await repository.create(file);

            expect(response).toBe(file);
        });
    });
})