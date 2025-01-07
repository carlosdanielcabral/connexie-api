import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "../../../interfaces/repositories/job-area-repository";

class FindJobAreaById {
  constructor(private readonly jobAreaRepository: JobAreaRepository) {}

  public execute = (id: number): Promise<JobArea | null> => {
    return this.jobAreaRepository.findById(id);
  }
}

export default FindJobAreaById;