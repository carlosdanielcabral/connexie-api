import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import JobAreaController from '../controllers/job-area-controller';

class JobAreaRoute implements Route {
    constructor(
        private readonly _controller: JobAreaController = new JobAreaController(),
    ) {
    }

    public register = (app: Express) => {
        app.get('/job-area', this._controller.list);
    }
}

export default JobAreaRoute;