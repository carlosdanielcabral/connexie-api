import bcrypt from 'bcrypt';

class CryptService {
  private readonly saltRounds: number = Number(process.env.SALT_ROUNDS);

  public encrypt = (data: string): string => {
    return bcrypt.hashSync(data, this.saltRounds);
  }

  public compare = (data: string, encrypted: string): boolean => {
    return bcrypt.compareSync(data, encrypted);
  }
}

export default CryptService;