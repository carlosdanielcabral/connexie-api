
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import FileRepository from "../../../infrastructure/database/repositories/file-repository";
import File from "../../../domain/entities/file";
import FindFileById from "./find-file-by-id";


describe("[Use Case] Find file by id", () => {
    const fileExpected = new File('original-name', 'encoding', 'mimeType', 'blobName', 1, 0, 'url', '1');

    const prisma = Sinon.createStubInstance(PrismaClient);

    const sandbox = Sinon.createSandbox();

    const repository = new FileRepository(prisma);

    afterEach(() => {
        sandbox.restore();
    });

    test("Return file by id", async () => {
        sandbox.stub(repository, 'findById').resolves(fileExpected);

        const useCase = new FindFileById(repository);

        const response = await useCase.execute(fileExpected.id!);

        expect(JSON.stringify(response)).toBe(JSON.stringify(fileExpected));
    });

    test("Return null when file not found", async () => {
        sandbox.stub(repository, 'findById').resolves(null);

        const useCase = new FindFileById(repository);

        const response = await useCase.execute(fileExpected.id!);

        expect(response).toBeNull();
    });
})