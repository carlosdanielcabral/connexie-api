import { randomUUID } from "crypto";

class RegisterServiceProviderImageDTO {
    public blobName: string;

    constructor(
      public originalName: string,
      public encoding: string,
      public mimeType: string,
      public size: number,
      public tempPath: string,
    ) {
        this.blobName = randomUUID();
    }
}
  
export default RegisterServiceProviderImageDTO;