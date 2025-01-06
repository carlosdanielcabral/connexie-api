import { Express } from 'express';
import Route from '../../../interfaces/routes/route';
import multer from 'multer';
import os from 'node:os';
import FileController from '../controllers/file-controller';
import FileMiddleware from '../middlewares/file-middleware';

class FileRoute implements Route {
    constructor(
        private readonly _controller: FileController = new FileController(),
        private readonly _middleware: FileMiddleware = new FileMiddleware(),
    ) {
    }

    public register = (app: Express) => {
        const upload = multer({ dest:  os.tmpdir() });

        app.post('/file', upload.single('file'), this._middleware.create, this._controller.create);
    }
}

export default FileRoute;