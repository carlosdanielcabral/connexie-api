import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import CustomerController from '../controllers/customer-controller';
import CustomerMiddleware from '../middlewares/customer-middleware';
import CustomerAuthMiddleware from '../middlewares/customer-auth-middleware';

class CustomerRoute implements Route {
    constructor(
        private readonly _controller: CustomerController = new CustomerController(),
        private readonly _middleware: CustomerMiddleware = new CustomerMiddleware(),
        private readonly _auth: CustomerAuthMiddleware = new CustomerAuthMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.post('/customer', this._middleware.create, this._controller.create);
        app.get('/customer', this._auth.validate, this._controller.findById);
    }
}

export default CustomerRoute;