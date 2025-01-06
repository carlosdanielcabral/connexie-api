import jwt from 'jsonwebtoken';

class TokenService implements TokenService {
  private readonly _secret: string = process.env.JWT_SECRET || 'secret';
  private readonly _expiresIn: string = process.env.JWT_EXPIRES_IN || '1h';

  public generate = (payload: object): string => jwt.sign(payload, this._secret, { expiresIn: this._expiresIn });

  public validate = (token: string) => jwt.verify(token, this._secret);
}

export default TokenService;