import { PrismaClient } from '@prisma/client';
import PasswordResetRequest from '../../../domain/entities/password-reset-request';
import User from '../../../domain/entities/user';
import File from '../../../domain/entities/file';
import IPasswordResetRequestRepository from '../../../interfaces/repositories/password-reset-request-repository';

class PasswordResetRequestRepository implements IPasswordResetRequestRepository {
 constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public create = async (request: PasswordResetRequest): Promise<PasswordResetRequest> => {
    await this.prisma.userPasswordResetRequest.create({
      data: {
        token: request.token,
        expiresAt: request.expiresAt,
        usedAt: request.usedAt,
        userId: request.user.id,
      },
    });

    return request;
  }

  public findById = async (id: number): Promise<PasswordResetRequest | null> => {
    const request = await this.prisma.userPasswordResetRequest.findUnique({
        where: { id },
        include: { user: {
            include: {
                profileImage: true,
            }
        } },
    });

    if (!request) return null;

    return new PasswordResetRequest(
        new User(
            request.user.id,
            request.user.name,
            request.user.email,
            request.user.password,
            request.user.profileImage ? new File(
                request.user.profileImage.originalName,
                request.user.profileImage.encoding,
                request.user.profileImage.mimeType,
                request.user.profileImage.blobName,
                request.user.profileImage.originalSize,
                request.user.profileImage.compressedSize,
                request.user.profileImage.url,
                request.user.profileImage.id,
            ) : null,
        ),
        request.token,
        request.createdAt,
        request.expiresAt,
        request.usedAt,
        request.id,
    );
  }

  public findLastByUser = async (userId: string): Promise<PasswordResetRequest | null> => {
    const request = await this.prisma.userPasswordResetRequest.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { user: {
            include: {
                profileImage: true,
            }
        } },
    });

    if (!request) return null;

    return new PasswordResetRequest(
        new User(
            request.user.id,
            request.user.name,
            request.user.email,
            request.user.password,
            request.user.profileImage ? new File(
                request.user.profileImage.originalName,
                request.user.profileImage.encoding,
                request.user.profileImage.mimeType,
                request.user.profileImage.blobName,
                request.user.profileImage.originalSize,
                request.user.profileImage.compressedSize,
                request.user.profileImage.url,
                request.user.profileImage.id,
            ) : null,
        ),
        request.token,
        request.createdAt,
        request.expiresAt,
        request.usedAt,
        request.id,
    );
  }

  public findByToken = async (token: string): Promise<PasswordResetRequest | null> => {
    const request = await this.prisma.userPasswordResetRequest.findFirst({
        where: { token },
        include: { user: {
            include: {
                profileImage: true,
            }
        } },
    });

    if (!request) return null;

    return new PasswordResetRequest(
        new User(
            request.user.id,
            request.user.name,
            request.user.email,
            request.user.password,
            request.user.profileImage ? new File(
                request.user.profileImage.originalName,
                request.user.profileImage.encoding,
                request.user.profileImage.mimeType,
                request.user.profileImage.blobName,
                request.user.profileImage.originalSize,
                request.user.profileImage.compressedSize,
                request.user.profileImage.url,
                request.user.profileImage.id,
            ) : null,
        ),
        request.token,
        request.createdAt,
        request.expiresAt,
        request.usedAt,
        request.id,
    );
  }

  public useToken = async (id: number): Promise<void> => {
    await this.prisma.userPasswordResetRequest.update({
        where: { id },
        data: { usedAt: new Date() },
    });
  }
}

export default PasswordResetRequestRepository;