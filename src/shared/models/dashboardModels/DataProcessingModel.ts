import { makeAutoObservable } from 'mobx';

import { FileUtils, MathUtils } from 'shared/utils';

import { IJointInfoDto } from '../../interfaces';

const TIME_KEY = 'Время';
const regSplitter = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;

export class DataProcessingModel {
  public isLoading = false;

  public data: Record<string, IJointInfoDto> = {};

  public tableHeader: string[] = [];
  public tableData: number[][] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get timeData(): number[] {
    const data = this.data[TIME_KEY]?.data || [];

    if (!data.length) return [];
    const firstItem = Math.floor(+data[0]);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.floor(+data[i]) - firstItem;
    }

    return data as number[];
  }

  public async loadFile(file: File) {
    this.isLoading = true;

    try {
      const loadedFile = await FileUtils.loadFileAsText(file);
      const rows = loadedFile.split('\n').filter((line) => line.length > 0);
      const headerKeys = rows[0]
        .split(regSplitter)
        .map((headerKey) => headerKey.replaceAll('"', '').trim());

      const tableData = new Array(rows.length - 1);

      for (let i = 1; i < rows.length; i++) {
        tableData[i - 1] = rows[i].split(',').map((val) => {
          const parsedVal = parseFloat(val);

          return isNaN(parsedVal) ? val : parseFloat(parsedVal.toFixed(4));
        });

        for (let j = 0; j < headerKeys.length; j++) {
          const headerKey = headerKeys[j];
          if (!this.data[headerKey])
            this.data[headerKey] = {
              data: [],
              mean: 0,
              std: 0,
              ucl: 0,
              lcl: 0,
              usl: 0,
              lsl: 0,
              min: 0,
              max: 0,
              ooc: [],
            };

          this.data[headerKey].data.push(tableData[i - 1][j]);
        }
      }

      this.tableHeader = headerKeys;
      this.tableData = tableData;

      for (const headerKey of headerKeys) {
        const currentItem = this.data[headerKey];

        if (!currentItem.data.every((val) => typeof val === 'number')) continue;

        const std = MathUtils.calculateStandardDeviation(currentItem.data as number[]);
        const mean = MathUtils.calculateMean(currentItem.data as number[]);

        const min = MathUtils.calculateMin(currentItem.data as number[]);
        const max = MathUtils.calculateMax(currentItem.data as number[]);
        const ucl = mean + 2 * std;
        const lcl = mean - 2 * std;
        const usl = mean + std;
        const lsl = mean - std;

        const ooc = MathUtils.calculateOutOfControl(currentItem.data as number[], ucl, lcl);

        currentItem.std = std;
        currentItem.mean = mean;
        currentItem.min = min;
        currentItem.max = max;
        currentItem.ucl = ucl;
        currentItem.lcl = lcl;
        currentItem.usl = usl;
        currentItem.lsl = lsl;
        currentItem.ooc = ooc;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }
}
