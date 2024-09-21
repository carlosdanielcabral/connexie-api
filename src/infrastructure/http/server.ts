import 'express-async-errors';
import App from "./app";

const server = new App();

server.start(Number(process.env.API_PORT));
