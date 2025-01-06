import bcrypt from 'bcrypt';
import IHashService from '../../interfaces/services/hash-service';

class HashService implements IHashService {
  private readonly saltRounds: number;

  constructor(saltRounds?: number) {
    if (saltRounds === undefined) {
      saltRounds = Number(process.env.SALT_ROUNDS);
    }

    this.saltRounds = saltRounds;
  }

  public hash = (data: string): string => {
    return bcrypt.hashSync(data, this.saltRounds);
  }

  public compare = (data: string, hashed: string): boolean => {
    return bcrypt.compareSync(data, hashed);
  }
}

export default HashService;