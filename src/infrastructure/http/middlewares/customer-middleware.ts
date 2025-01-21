import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import { randomUUID } from "crypto";
import RegisterCustomerDTO from "../../../application/dtos/customer/register-customer";
import UpdateCustomerDTO from "../../../application/dtos/customer/update-customer";

class CustomerMiddleware {
  public create = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      profileImage: z.string(),
    }).parse(req.body);

    req.body.dto = new RegisterCustomerDTO(
      randomUUID(),
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.profileImage,
    );

    return next();
  }

  public update = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      name: z.string(),
      password: z.string().min(8).optional(),
      profileImage: z.string().optional(),
    }).parse(req.body);

    req.body.dto = new UpdateCustomerDTO(
      req.body.name,
      req.body.password,
      req.body.profileImage,
    );

    return next();
  }
}

export default CustomerMiddleware;