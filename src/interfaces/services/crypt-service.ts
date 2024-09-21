interface CryptService {
    encrypt(data: string): string;
    compare(data: string, encrypted: string): boolean;
}

export default CryptService;
