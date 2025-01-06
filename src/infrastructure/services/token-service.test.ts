import { JsonWebTokenError } from "jsonwebtoken";
import TokenService from "./token-service";

describe("[Service] Token Service", () => {
    describe("01. Hash", () => {
        test("Return a string", async () => {
            const tokenService = new TokenService();

            const payload = { name: 'Test' };

            const token = tokenService.generate(payload);

            expect(typeof token).toBe('string');
        });
    });

    describe("02. Validate", () => {
        test("Return false if token is invalid", async () => {
            const tokenService = new TokenService();

            const token = 'ey879dan879a87987987D987';

            try {
                tokenService.validate(token);
            } catch (error) {
                expect(error).toBeInstanceOf(JsonWebTokenError);
            }
        });

        test("Return true if token is valid", async () => {
            const tokenService = new TokenService();

            const payload = { name: 'Test' };

            const token = tokenService.generate(payload);
            const comparison = tokenService.validate(token);

            expect(typeof comparison).toBe('object');
        });
    });
})