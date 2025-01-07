
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "../../../infrastructure/database/repositories/job-area-repository";
import FindJobAreaById from "./find-job-area-by-id";

describe("[Use Case] Find job area by id", () => {
    const jobAreaExpected = new JobArea('Test Job Area', 1);

    const prisma = Sinon.createStubInstance(PrismaClient);

    const repository = new JobAreaRepository(prisma);

    const sandbox = Sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("Return job area by id", async () => {
        sandbox.stub(repository, 'findById').resolves(jobAreaExpected);

        const useCase = new FindJobAreaById(repository);

        const response = await useCase.execute(jobAreaExpected.id!);

        expect(JSON.stringify(response)).toBe(JSON.stringify(jobAreaExpected));
    });

    test("Return null when job area not found", async () => {
        sandbox.stub(repository, 'findById').resolves(null);

        const useCase = new FindJobAreaById(repository);

        const response = await useCase.execute(jobAreaExpected.id!);

        expect(response).toBeNull();
    });
})