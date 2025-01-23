import User from "./user";

class PasswordResetRequest {
  constructor(
    private _user: User,
    private _token: string,
    private _createdAt: Date,
    private _expiresAt: Date,
    private _usedAt: Date | null,
    private _id?: number,
  ) {}

  get id(): number | undefined {
    return this._id;
  }

  get user(): User {
    return this._user;
  }

  get token(): string {
    return this._token;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get usedAt(): Date | null {
    return this._usedAt;
  }

  get isActive(): boolean {
    return !this.isExpired && !this.usedAt;
  }

  get isExpired(): boolean {
    const now = new Date();

    return this._expiresAt < now;
  }

  public async tojson() {
    return {
      id: this._id,
      user: this.user.toJson(),
      token: this._token,
      createdAt: this._createdAt.toDateString(),
      expiresAt: this._expiresAt.toDateString(),
      usedAt: this._usedAt?.toDateString(),
    };
  }
}

export default PasswordResetRequest;