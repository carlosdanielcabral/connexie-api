import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import { randomUUID } from "crypto";
import RegisterFileDTO from "../../../application/dtos/file/register-file";

class FileMiddleware {
  public create = (req: Request, res: Response, next: NextFunction) => {
    z.object({
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        size: z.number(),
    }).parse(req.file);

    req.body.dto = new RegisterFileDTO(
        randomUUID(),
          req.file!.originalname,
          req.file!.encoding,
          req.file!.mimetype,
          req.file!.size,
          req.file!.path
    );

    return next();
  }
}

export default FileMiddleware;