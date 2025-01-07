
import { PrismaClient } from "@prisma/client";
import Sinon from "sinon";
import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "./job-area-repository";

describe("[Repository] Job Area", () => {
    const area = new JobArea('Test Job Area', 1);

    const prisma = new PrismaClient();

    describe("01. Find by id", () => {
        afterEach(() => {
            Sinon.restore();
        });

        test("Return area after success search", async () => {
            Sinon.stub(prisma, 'jobArea').value({
                findUnique: Sinon.stub().resolves({
                    id: area.id!,
                    title: area.title,
                }),
            });

            const repository = new JobAreaRepository(prisma);

            const response = await repository.findById(area.id!);

            expect(JSON.stringify(response)).toBe(JSON.stringify(area));
        });

        test("Return null when area not found", async () => {
            Sinon.stub(prisma, 'jobArea').value({
                findUnique: Sinon.stub().resolves(null),
            });

            const repository = new JobAreaRepository(prisma);

            const response = await repository.findById(area.id!);

            expect(response).toBeNull();
        });
    });

    describe("02. List", () => {
        afterEach(() => {
            Sinon.restore();
        });

        test("Return areas", async () => {
            Sinon.stub(prisma, 'jobArea').value({
                findMany: Sinon.stub().resolves([{
                    id: area.id!,
                    title: area.title,
                }]),
            });

            const repository = new JobAreaRepository(prisma);

            const response = await repository.list();

            expect(JSON.stringify(response)).toBe(JSON.stringify([area]));
        });
    })
})