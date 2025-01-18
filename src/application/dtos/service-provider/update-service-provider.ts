import { JobMode } from '../../../domain/entities/service-provider';
import UpdateServiceProviderContactDTO from './update-service-provider-contact';
import UpdateServiceProviderAddressDTO from './update-service-provider-address';

class UpdateServiceProviderDTO {
  constructor(
    public name: string,
    public contacts: UpdateServiceProviderContactDTO[],
    public description: string,
    public jobMode: JobMode,
    public jobAreaId: number,
    public profileImage?: string,
    public address?: UpdateServiceProviderAddressDTO,
    public password?: string,
  ) {}
}

export default UpdateServiceProviderDTO;