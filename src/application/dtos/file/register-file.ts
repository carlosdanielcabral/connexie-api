import { randomUUID } from "crypto";

class RegisterFileDTO {
    constructor(
      public id: string = randomUUID(),
      public originalName: string,
      public encoding: string,
      public mimeType: string,
      public size: number,
      public tempPath: string,
    ) {}
}
  
export default RegisterFileDTO;