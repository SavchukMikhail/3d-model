import { makeAutoObservable } from 'mobx';

import { IJointInfoDto } from '../shared/interfaces';
import { DataProcessingModel, JointModel } from '../shared/models/dashboardModels';

class DashboardStore {
  public dataLoader: DataProcessingModel = new DataProcessingModel();

  public selectedJoint: JointModel | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setSelectedJoint(jointName: string, dto: IJointInfoDto) {
    this.selectedJoint = new JointModel(jointName, dto);
  }

  public clearSelectedJoint() {
    this.selectedJoint = null;
  }
}

export default new DashboardStore();
