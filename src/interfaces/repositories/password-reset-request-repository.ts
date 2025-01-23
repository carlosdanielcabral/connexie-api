import PasswordResetRequest from "../../domain/entities/password-reset-request";

interface PasswordResetRequestRepository {
    create(request: PasswordResetRequest): Promise<PasswordResetRequest>;
    findByToken(token: string): Promise<PasswordResetRequest | null>;
    findById(id: number): Promise<PasswordResetRequest | null>;
    useToken(id: number): Promise<void>;
}

export default PasswordResetRequestRepository;
