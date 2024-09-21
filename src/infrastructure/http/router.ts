import { Express } from 'express';
import Route from '../../interfaces/routes/route';
import ServiceProviderRoute from './routes/service-provider-route';

class Router {
    constructor(
        private readonly _serviceProviderRoute: Route = new ServiceProviderRoute(),
    ) {
    }

    public register = (app: Express) => {
        app.get('/', (req, res) => res.json({ online: true }));

        this._serviceProviderRoute.register(app);
    }
}

export default Router;