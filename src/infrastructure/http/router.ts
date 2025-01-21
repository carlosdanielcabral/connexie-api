import { Express } from 'express';
import Route from '../../interfaces/routes/route';
import ServiceProviderRoute from './routes/service-provider-route';
import FileRoute from './routes/file-route';
import JobAreaRoute from './routes/job-area';
import AddressRoute from './routes/address-route';
import CustomerRoute from './routes/customer-route';
import LoginRoute from './routes/login-route';

class Router {
    constructor(
        private readonly _serviceProviderRoute: Route = new ServiceProviderRoute(),
        private readonly _fileRoute: Route = new FileRoute(),
        private readonly _jobAreaRoute: Route = new JobAreaRoute(),
        private readonly _addressRoute: Route = new AddressRoute(),
        private readonly _customerRoute: Route = new CustomerRoute(),
        private readonly _loginRoute: Route = new LoginRoute(),
    ) {
    }

    public register = (app: Express) => {
        app.get('/', (req, res) => res.json({ online: true }));

        this._serviceProviderRoute.register(app);
        this._fileRoute.register(app);
        this._jobAreaRoute.register(app);
        this._addressRoute.register(app);
        this._customerRoute.register(app);
        this._loginRoute.register(app);
    }
}

export default Router;