interface HashService {
    hash(data: string): string;
    compare(data: string, encrypted: string): boolean;
}

export default HashService;
