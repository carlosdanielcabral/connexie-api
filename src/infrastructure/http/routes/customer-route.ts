import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import AuthMiddleware from '../middlewares/auth-middleware';
import CustomerController from '../controllers/customer-controller';
import CustomerMiddleware from '../middlewares/customer-middleware';

class CustomerRoute implements Route {
    constructor(
        private readonly _controller: CustomerController = new CustomerController(),
        private readonly _middleware: CustomerMiddleware = new CustomerMiddleware(),
        private readonly _auth: AuthMiddleware = new AuthMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.post('/customer', this._middleware.create, this._controller.create);
    }
}

export default CustomerRoute;