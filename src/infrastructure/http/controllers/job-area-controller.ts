import { Request, Response } from "express";
import HttpStatusCode from "../status-code";
import IJobAreaRepository from "../../../interfaces/repositories/job-area-repository";
import JobAreaRepository from "../../database/repositories/job-area-repository";

class JobAreaController {
    constructor(
        private readonly _repository: IJobAreaRepository = new JobAreaRepository(),
    ) {}

    public list = async (req: Request, res: Response) => {
        const jobAreas = await this._repository.list();

        return res
            .status(HttpStatusCode.Ok)
            .json({ jobAreas: jobAreas.map((jobArea) => jobArea.toJson()) });
    }
}

export default JobAreaController;
