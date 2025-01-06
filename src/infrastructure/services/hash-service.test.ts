import HashService from "./hash-service";

describe("[Service] Hash Service", () => {
    describe("01. Hash", () => {
        test("Return an hashed string", async () => {
            const hashService = new HashService(2);

            const text = 'random-text';

            const hashed = hashService.hash(text);

            expect(hashed.indexOf(text) === -1).toBe(true);
        });
    });

    describe("02. Compare", () => {
        test("Return false if texts are differents", async () => {
            const hashService = new HashService(2);

            const text = 'random-text';

            const hashed = hashService.hash(text);
            const comparison = hashService.compare('different-text', hashed);

            expect(comparison).toBe(false);
        });

        test("Return true if texts are equals", async () => {
            const hashService = new HashService(2);

            const text = 'random-text';

            const hashed = hashService.hash(text);
            const comparison = hashService.compare(text, hashed);

            expect(comparison).toBe(true);
        });
    });
})