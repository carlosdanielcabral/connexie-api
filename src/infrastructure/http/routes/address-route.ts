import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import AddressController from '../controllers/address-controller';
import AddressMiddleware from '../middlewares/address-middleware';

class AddressRoute implements Route {
    constructor(
        private readonly _controller: AddressController = new AddressController(),
        private readonly _middleware: AddressMiddleware = new AddressMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        app.get('/address', this._middleware.list, this._controller.list);
    }
}

export default AddressRoute;