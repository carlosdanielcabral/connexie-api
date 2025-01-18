import { JwtPayload } from "jsonwebtoken";

interface TokenService {
    generate(payload: object): string;
    validate(token: string): JwtPayload;
}

export default TokenService;
