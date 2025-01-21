import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import ServiceProviderController from '../controllers/service-provider-controller';
import ServiceProviderMiddleware from '../middlewares/service-provider-middleware';
import ServiceProviderAuthMiddleware from '../middlewares/service-provider-auth-middleware';

class ServiceProviderRoute implements Route {
    constructor(
        private readonly _controller: ServiceProviderController = new ServiceProviderController(),
        private readonly _middleware: ServiceProviderMiddleware = new ServiceProviderMiddleware(),
        private readonly _auth: ServiceProviderAuthMiddleware = new ServiceProviderAuthMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.post('/service-provider', this._middleware.create, this._controller.create);
        app.get('/service-provider', this._middleware.list, this._controller.list);
        app.put('/service-provider', this._auth.validate, this._middleware.update, this._controller.update);
    }
}

export default ServiceProviderRoute;