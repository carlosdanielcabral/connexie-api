import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import RegisterServiceProviderDTO from "../../../application/dtos/service-provider/register-service-provider";
import RegisterServiceProviderContactDTO from "../../../application/dtos/service-provider/register-service-provider-contact";
import { randomUUID } from "crypto";
import { ListServiceProviderFilter } from "../../../interfaces/repositories/service-provider-repository";
import RegisterServiceProviderAddressDTO from "../../../application/dtos/service-provider/register-service-provider-address";
import { JobMode } from "../../../domain/entities/service-provider";
import UpdateServiceProviderAddressDTO from "../../../application/dtos/service-provider/update-service-provider-address";
import UpdateServiceProviderContactDTO from "../../../application/dtos/service-provider/update-service-provider-contact";
import UpdateServiceProviderDTO from "../../../application/dtos/service-provider/update-service-provider";
import ServiceProviderContact from "../../../domain/entities/service-provider-contact";

class ServiceProviderMiddleware {
  public create = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      contacts: z.object({
        email: z.string().email(),
        phone: z.string(),
        cellphone: z.string(),
      }).optional(),
      description: z.string(),
      profileImage: z.string(),
      jobMode: z.enum(['remote', 'onsite', 'both']),
      address: z.object({
        cep: z.string().length(8),
        city: z.string(),
        state: z.string(),
        uf: z.string().length(2),
      }).optional(),
      jobAreaId: z.number().int(),
    }).parse(req.body);

    req.body.dto = new RegisterServiceProviderDTO(
      randomUUID(),
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.contacts ? [new RegisterServiceProviderContactDTO(
        req.body.contacts.email,
        req.body.contacts.phone,
        req.body.contacts.cellphone
      )] : [],
      req.body.description,
      req.body.profileImage,
      req.body.jobMode,
      req.body.jobAreaId,
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
      page: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive()
      ).optional(),
      limit: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive()
      ).optional(),
      addressId: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive(),
      ).optional(),
      jobAreaId: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive(),
      ).optional(),
      jobMode: z.enum([JobMode.BOTH, JobMode.ONSITE, JobMode.REMOTE]).optional(),
    }).parse(req.query);

    const filter: ListServiceProviderFilter = {};

    if (req.query.keyword) {
      filter.keyword = req.query.keyword.toString();
    }

    if (req.query.page) {
      filter.page = Number(req.query.page);
    }

    if (req.query.limit) {
      filter.limit = Number(req.query.limit);
    }

    if (req.query.addressId) {
      filter.addressId = Number(req.query.addressId);
    }

    if (req.query.jobAreaId) {
      filter.jobAreaId = Number(req.query.jobAreaId);
    }

    if (req.query.jobMode) {
      filter.jobMode = req.query.jobMode as JobMode;
    }

    req.body = { filter };

    return next();
  }

  public update = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      name: z.string().optional(),
      password: z.string().min(8).optional(),
      contacts: z.array(z.object({
        email: z.string().email(),
        phone: z.string(),
        cellphone: z.string(),
      })).optional(),
      description: z.string().optional(),
      profileImage: z.string().optional(),
      jobMode: z.enum(['remote', 'onsite', 'both']).optional(),
      jobAreaId: z.number().int().optional(),
    }).parse(req.body);

    if (req.body.jobMode !== JobMode.REMOTE) {
      z.object({
        address: z.object({
          cep: z.string().length(8),
          city: z.string(),
          state: z.string(),
          uf: z.string().length(2),
        }),
      }).parse(req.body);
    }

    req.body.dto = new UpdateServiceProviderDTO(
      req.body.name,
      req.body.contacts ? req.body.contacts.map((contact: ServiceProviderContact) => new UpdateServiceProviderContactDTO(
        contact.email,
        contact.phone,
        contact.cellphone
      )) : [],
      req.body.description,
      req.body.jobMode,
      req.body.jobAreaId,
      req.body.profileImage,
      req.body.address ? new UpdateServiceProviderAddressDTO(
        req.body.address.cep,
        req.body.address.city,
        req.body.address.state,
        req.body.address.uf,
      ) : undefined,
      req.body.password,
    );

    return next();
  }
}

export default ServiceProviderMiddleware;