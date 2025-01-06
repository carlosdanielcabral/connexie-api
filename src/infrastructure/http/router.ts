import { Express } from 'express';
import Route from '../../interfaces/routes/route';
import ServiceProviderRoute from './routes/service-provider-route';
import FileRoute from './routes/file-route';

class Router {
    constructor(
        private readonly _serviceProviderRoute: Route = new ServiceProviderRoute(),
        private readonly _fileRoute: Route = new FileRoute(),
    ) {
    }

    public register = (app: Express) => {
        app.get('/', (req, res) => res.json({ online: true }));

        this._serviceProviderRoute.register(app);
        this._fileRoute.register(app);
    }
}

export default Router;