import { IPatientGetDto } from 'shared/interfaces';

import BaseApiService from './BaseApiService';

class PatientsApiService extends BaseApiService {
  constructor() {
    super('api');
  }

  getPatients(): Promise<IPatientGetDto[]> {
    return this.GETBYID('userlist');
  }

  getPatientInfo(patientId: number): Promise<IPatientGetDto> {
    return this.GETBYID(`userdata/${patientId}`);
  }
}

export default new PatientsApiService();
