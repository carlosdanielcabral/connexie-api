import JobArea from "../../domain/entities/job-area";

interface JobAreaRepository {
    findById(id: number): Promise<JobArea | null>;
    list(): Promise<JobArea[]>;
}

export default JobAreaRepository;
