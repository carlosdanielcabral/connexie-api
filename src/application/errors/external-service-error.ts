class ExternalServiceError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default ExternalServiceError;
