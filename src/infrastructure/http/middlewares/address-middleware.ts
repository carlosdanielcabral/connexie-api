import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import { ListAddressFilter } from "../../../interfaces/repositories/address-repository";

class AddressMiddleware {
  public list = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      keyword: z.string().optional(),
      page: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive(),
      ).optional(),
      limit: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int().positive().optional(),
      ).optional(),
    }).parse(req.query);

    const filter: ListAddressFilter = {};

    if (req.query.keyword) {
      filter.keyword = req.query.keyword.toString();
    }

    if (req.query.page) {
      filter.page = Number(req.query.page);
    }

    if (req.query.limit) {
      filter.limit = Number(req.query.limit);
    }

    req.body = { filter };

    return next();
  }
}

export default AddressMiddleware;