
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "../../../infrastructure/database/repositories/job-area-repository";
import ListJobArea from "./list-job-area";

describe("[Use Case] List Job Area", () => {
    const jobAreasExpected = [
        new JobArea('Test Job Area', 1),
        new JobArea('Test Job Area 2', 2),
    ]

    const prisma = Sinon.createStubInstance(PrismaClient);
    const repository = new JobAreaRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return job areas", async () => {
        sandbox.stub(repository, 'list').returns(Promise.resolve(jobAreasExpected));

        const useCase = new ListJobArea(repository);

        const response = await useCase.execute();

        expect(response).toBe(jobAreasExpected);
    });

    test("Return empty array when job areas not found", async () => {
        sandbox.stub(repository, 'list').returns(Promise.resolve([]));

        const useCase = new ListJobArea(repository);

        const response = await useCase.execute();

        expect(response).toEqual([]);
    });
})