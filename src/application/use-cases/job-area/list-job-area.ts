import JobArea from "../../../domain/entities/job-area";
import JobAreaRepository from "../../../interfaces/repositories/job-area-repository";

class ListJobArea {
    constructor(private _jobAreaRepository: JobAreaRepository) { }

    public execute = async (): Promise<JobArea[]> => {
        return this._jobAreaRepository.list();
    }
}

export default ListJobArea;
