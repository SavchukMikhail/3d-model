import { makeAutoObservable } from 'mobx';

import { PatientsApiService } from '../services';
import { IPatientGetDto } from '../shared/interfaces';

class PatientsStore {
  public isLoading = false;

  public searchValue = '';

  public patients: IPatientGetDto[] = [];

  public selectedPatientId: number | null = null;

  public dates: any = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get filteredPatients() {
    return this.patients.filter((patient) =>
      patient.username.toLowerCase().includes(this.searchValue.toLowerCase()),
    );
  }

  public setSearchValue(searchValue: string) {
    this.searchValue = searchValue;
  }

  public async selectPatient(selectedPatientId: number) {
    this.selectedPatientId = selectedPatientId;
    this.isLoading = true;

    try {
      const dates = await PatientsApiService.getDatesListByPatientId(selectedPatientId);
      this.dates = dates;
      console.log(dates);
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  public async getPatients() {
    try {
      this.isLoading = false;

      this.patients = await PatientsApiService.getPatients();
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  public deInit() {
    this.patients = [];
    this.selectedPatientId = null;
    this.searchValue = '';
  }
}

export default new PatientsStore();
