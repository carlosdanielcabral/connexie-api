import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import RegisterServiceProviderContactDTO from "../../../application/dtos/service-provider/register-service-provider-contact";
import { randomUUID } from "crypto";
import RegisterServiceProviderImageDTO from "../../../application/dtos/file/register-file";

class ServiceProviderMiddleware {
  public create = (req: Request, res: Response, next: NextFunction) => {
    z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        contacts: z.array(z.object({
            email: z.string().email(),
            phone: z.string(),
            cellphone: z.string(),
        })).optional(),
        description: z.string(),
        profileImage: z.string(),
    }).parse(req.body);

    req.body.dto = new RegisterServiceProviderDTO(
        randomUUID(),
        req.body.name,
        req.body.email,
        req.body.password,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.body.contacts?.map((contact: any) => new RegisterServiceProviderContactDTO(
            contact.email,
            contact.phone,
            contact.cellphone
        )) ?? [],
        req.body.description,
        req.body.profileImage,
    );

    return next();
  }

  public login = (req: Request, res: Response, next: NextFunction) => {
    z.object({
        email: z.string().email(),
        password: z.string(),
    }).parse(req.body);

    return next();
  }
}

export default ServiceProviderMiddleware;