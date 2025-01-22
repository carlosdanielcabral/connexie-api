import express, { Express, json } from 'express';
import cors from 'cors';
import Router from './router';
import error from './middlewares/error';
import { rateLimit } from 'express-rate-limit';

class App {
    constructor(
        private readonly _app: Express = express(),
        private readonly _router: Router = new Router(),
    ) {
        this.config();
    }

    public start = (port: number) => {
        this._app.listen(port, () => console.log(`Server running on port ${port}`));
    }

    private config = () => {
        const rateLimiter = rateLimit({
            windowMs: 60 * 1000, 
            limit: 100, 
        	standardHeaders: true,
	        legacyHeaders: false,
        });

        this._app.use(rateLimiter);
        this._app.use(json());
        this._app.use(cors());
        this._router.register(this._app);
        this._app.use(error);
    }
}

export default App;