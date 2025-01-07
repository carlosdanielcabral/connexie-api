import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import RegisterServiceProviderContactDTO from "../../../application/dtos/service-provider/register-service-provider-contact";
import { randomUUID } from "crypto";
import { ListServiceProviderFilter } from "../../../interfaces/repositories/service-provider-repository";
import RegisterServiceProviderAddressDTO from "../../../application/dtos/service-provider/register-service-provider-address";

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
      jobMode: z.enum(['remote', 'onsite', 'both']),
      address: z.object({
        cep: z.string().length(8),
        city: z.string(),
        state: z.string(),
        uf: z.string().length(2),
      }).optional(),

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
      req.body.jobMode,
      !req.body.address ? undefined : new RegisterServiceProviderAddressDTO(
        req.body.address.cep,
        req.body.address.city,
        req.body.address.state,
        req.body.address.uf,
      ),
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

  public list = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      keyword: z.string().optional(),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().default(10),
    }).parse(req.query);

    const filter: ListServiceProviderFilter = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    if (req.query.keyword) {
      filter.keyword = req.query.keyword.toString();
    }

    req.body = { filter };

    return next();
  }
}

export default ServiceProviderMiddleware;