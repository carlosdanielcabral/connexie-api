import { Request, Response, NextFunction } from "express"
import { z } from "zod";
import { ListAddressFilter } from "../../../interfaces/repositories/address-repository";

class AddressMiddleware {
  public list = (req: Request, res: Response, next: NextFunction) => {
    z.object({
      keyword: z.string().optional(),
    }).parse(req.query);

    const filter: ListAddressFilter = {};

    if (req.query.keyword) {
      filter.keyword = req.query.keyword.toString();
    }

    req.body = { filter };

    return next();
  }
}

export default AddressMiddleware;