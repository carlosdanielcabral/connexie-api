import { JwtPayload } from "jsonwebtoken";

interface TokenService {
    generate(payload: object): string;
    validate(token: string): JwtPayload | string;
}

export default TokenService;
