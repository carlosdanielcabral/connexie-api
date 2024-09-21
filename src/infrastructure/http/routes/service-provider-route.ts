import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import ServiceProviderController from '../controllers/service-provider-controller';
import ServiceProviderMiddleware from '../middlewares/service-provider-middleware';

class ServiceProviderRoute implements Route {
    constructor(
        private readonly _controller: ServiceProviderController = new ServiceProviderController(),
        private readonly _middleware: ServiceProviderMiddleware = new ServiceProviderMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.post('/service-provider', this._middleware.create, this._controller.create);
    }
}

export default ServiceProviderRoute;