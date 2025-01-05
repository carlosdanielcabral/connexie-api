import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import ServiceProviderController from '../controllers/service-provider-controller';
import ServiceProviderMiddleware from '../middlewares/service-provider-middleware';
import multer from 'multer';
import os from 'node:os';

class ServiceProviderRoute implements Route {
    constructor(
        private readonly _controller: ServiceProviderController = new ServiceProviderController(),
        private readonly _middleware: ServiceProviderMiddleware = new ServiceProviderMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        const upload = multer({ dest:  os.tmpdir() });

        app.post('/service-provider', upload.single('profileImage'), this._middleware.create, this._controller.create);
        app.post('/service-provider/login', this._middleware.login, this._controller.login);
        app.get('/service-provider', this._controller.list);
    }
}

export default ServiceProviderRoute;