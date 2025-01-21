import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import CustomerLoginController from '../controllers/customer-login-controller';
import LoginMiddleware from '../middlewares/login-middleware';
import ServiceProviderLoginController from '../controllers/service-provider-login-controller';

class LoginRoute implements Route {
    constructor(
        private readonly _serviceProviderLoginController: ServiceProviderLoginController = new ServiceProviderLoginController(),
        private readonly _customerLoginController: CustomerLoginController = new CustomerLoginController(),
        private readonly _middleware: LoginMiddleware = new LoginMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.post('/login/service-provider', this._middleware.defaultLogin, this._serviceProviderLoginController.login);
        app.post('/login/customer', this._middleware.defaultLogin, this._customerLoginController.login);
    }
}

export default LoginRoute;