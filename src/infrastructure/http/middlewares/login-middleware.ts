import { Request, Response, NextFunction } from "express"
import { z } from "zod";

class LoginMiddleware {
  public defaultLogin = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      email: z.string().email(),
      password: z.string(),
    }).parse(req.body);

    return next();
  }
}

export default LoginMiddleware;