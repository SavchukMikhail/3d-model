import { makeAutoObservable } from 'mobx';

import { dashboardStore } from 'stores';

import { ERROR_COLOR, jointsToMuscles, SUCCESS_COLOR, WARNING_COLOR } from 'shared/constants';
import { IJointInfoDto } from 'shared/interfaces';

const MAX_TICKS = 10;

export class JointModel {
  public name: string;

  public jointData: IJointInfoDto;

  constructor(jointName: string, dto: IJointInfoDto) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.name = jointName;
    this.jointData = dto;
  }

  public get xAxisTicks() {
    const maxLength = this.jointData.data.length;
    const oneStep = Math.ceil(maxLength / MAX_TICKS);

    const ticks: number[] = [];

    for (let i = 0; i < maxLength; i += oneStep) ticks.push(i);

    if (ticks.length < MAX_TICKS) ticks.push(maxLength);
    else ticks[ticks.length - 1] = maxLength - 1;

    return ticks;
  }

  public get pieChartData() {
    const muscles = jointsToMuscles.get(this.name);
    const data: { name: string; value: number }[] = [];
    const colors: string[] = [];

    muscles?.forEach((muscle) => {
      const muscleData = dashboardStore.dataLoader.data[muscle];

      const ooc = muscleData.ooc[muscleData.ooc.length - 1] * 100 + 1;
      data.push({ name: muscle, value: ooc });

      if (ooc > 6) colors.push(SUCCESS_COLOR);
      else if (ooc > 4) colors.push(WARNING_COLOR);
      else colors.push(ERROR_COLOR);
    });

    return {
      data,
      colors,
    };
  }
}
