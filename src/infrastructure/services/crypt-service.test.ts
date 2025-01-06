
import CryptService from "./crypt-service";

describe("[Service] Crypt Service", () => {
    describe("01. Encrypt", () => {
        test("Return an encrypted string", async () => {
            const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

            const text = 'random-text';

            const encrypted = cryptService.encrypt(text);

            expect(encrypted.indexOf(text) === -1).toBe(true);
        });
    });

    describe("02. Decrypt", () => {
        test("Return the encrypted string correctly", async () => {
            const cryptService = new CryptService('3BWrUbi4bMHcHoPn5zZgvcitJRUc8wOB');

            const text = 'random-text';

            const encrypted = cryptService.encrypt(text);
            const decrypted = cryptService.decrypt(encrypted);

            expect(text).toBe(decrypted);
        });
    });
})