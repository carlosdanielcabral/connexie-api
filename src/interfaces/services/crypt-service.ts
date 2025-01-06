interface CryptService {
    encrypt(data: string): string;
    decrypt(data: string): string;
}

export default CryptService;
