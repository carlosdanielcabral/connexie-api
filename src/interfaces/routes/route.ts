import { Express } from 'express';

interface Route {
    register(app: Express): void;
}

export default Route;