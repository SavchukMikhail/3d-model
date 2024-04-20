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

  getDatesListByPatientId(patientId: number): Promise<any> {
    return this.POST(`userdata/`, JSON.stringify({ userid: patientId }));
  }

  getUserListDateCheck(patientId: number, date: string) {
    return this.POST('userlist_check', { userid: patientId, date });
  }

  getUserListDateCSV(csvId: number, levelNumber: number) {
    return this.POST('userlist_csv', { id: csvId, levelNumber });
  }
}

export default new PatientsApiService();
