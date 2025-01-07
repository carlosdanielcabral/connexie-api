import { PrismaClient } from '@prisma/client';
import IJobAreaRepository from '../../../interfaces/repositories/job-area-repository';
import JobArea from '../../../domain/entities/job-area';

class JobAreaRepository implements IJobAreaRepository {
    constructor(private prisma: PrismaClient = new PrismaClient()) { }

    public findById = async (id: number): Promise<JobArea | null> => {
        const area = await this.prisma.jobArea.findUnique({ where: { id } });

        if (!area) return null;

        return new JobArea(
            area.title,
            area.id,
        );
    }

    public list = async (): Promise<JobArea[]> => {
        const areas = await this.prisma.jobArea.findMany();

        return areas.map(area => new JobArea(
            area.title,
            area.id,
        ));
    }
}

export default JobAreaRepository;