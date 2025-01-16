import { JobMode } from '../../../domain/entities/service-provider';
import UpdateServiceProviderContactDTO from './update-service-provider-contact';
import UpdateServiceProviderAddressDTO from './update-service-provider-address';

class UpdateServiceProviderDTO {
  constructor(
    public id: string,
    public name: string,
    public password: string,
    public contacts: UpdateServiceProviderContactDTO[],
    public description: string,
    public profileImage: string,
    public jobMode: JobMode,
    public jobAreaId: number,
    public address?: UpdateServiceProviderAddressDTO,
  ) {}
}

export default UpdateServiceProviderDTO;