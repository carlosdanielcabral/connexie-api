import crypto from 'crypto'
import ICryptService from '../../interfaces/services/crypt-service';

class CryptService implements ICryptService {
  private readonly method: string = 'aes-256-cbc';
  private readonly key: string;

  constructor(key?: string) {
    this.key = key ?? crypto
      .createHash('sha512')
      .update(process.env.ENCRYPTION_KEY as string)
      .digest('hex')
      .substring(0, 32);
  }

  public encrypt = (data: string): string => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.method, this.key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(data, 'utf8'), cipher.final()]);

    return encrypted.toString('base64url');
  }

  public decrypt = (data: string): string => {
    const buffer = Buffer.from(data, 'base64url');
  
    const iv = buffer.subarray(0, 16);
    const ciphertext = buffer.subarray(16);
  
    const cipher = crypto.createDecipheriv(this.method, this.key, iv);
    const decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
  
    return decrypted.toString('utf-8');
  }
}

export default CryptService;