import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { dashboardStore } from 'stores';

import { PanelWrapper } from 'components';
import { ERROR_COLOR, JOINTS, SUCCESS_COLOR, WARNING_COLOR } from 'shared/constants';

import './StatisticsTable.scss';

const GRADIENT_STEPS = 20;

const getPercentageString = (ooc: number[]) => {
  const oocPercentage = ooc[ooc.length - 1] * 100;

  return oocPercentage.toFixed(2) + '%';
};

const getResultColor = (ooc: number[]) => {
  const oocPercentage = ooc[ooc.length - 1] * 100;

  if (oocPercentage <= 3) return ERROR_COLOR;
  if (oocPercentage < 6) return WARNING_COLOR;

  return SUCCESS_COLOR;
};

const getGradientSteps = (ooc: number[]): null[] => {
  const oocPercentage = ooc[ooc.length - 1] * 100;
  const stepsCount = Math.min(Math.ceil(oocPercentage), GRADIENT_STEPS / 2) * 2;

  return new Array(stepsCount).fill(null);
};

const getGradientColor = (currentStep: number) => {
  return currentStep < GRADIENT_STEPS * 0.4
    ? ERROR_COLOR
    : currentStep < GRADIENT_STEPS * 0.7
    ? WARNING_COLOR
    : SUCCESS_COLOR;
};

const cnStatisticsTable = block('StatisticsTable');

const StatisticsTable = () => {
  return (
    <PanelWrapper className={cnStatisticsTable()}>
      <TableContainer component={Paper} className={cnStatisticsTable('table').toString()}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Сустав</TableCell>
              <TableCell align="center">Длительность</TableCell>
              <TableCell align="center">Активность</TableCell>
              <TableCell align="center">Результат</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {JOINTS.map((joint, index) => {
              const jointValues = dashboardStore.dataLoader.data[joint];
              if (!jointValues) return null;

              const oocPercentageStr = getPercentageString(jointValues.ooc);
              const color = getResultColor(jointValues.ooc);
              const gradientSteps = getGradientSteps(jointValues.ooc);

              const selectRow = () => {
                dashboardStore.setSelectedJoint(joint, jointValues);
              };

              return (
                <TableRow
                  key={joint + index}
                  onClick={selectRow}
                  className={cnStatisticsTable('row', {
                    selected: dashboardStore.selectedJoint?.name === joint,
                  }).toString()}
                >
                  <TableCell>{joint}</TableCell>
                  <TableCell align="center">{oocPercentageStr}</TableCell>
                  <TableCell align="center">
                    <div
                      className={cnStatisticsTable('gradient')}
                      style={{ width: `${GRADIENT_STEPS * 6}px` }}
                    >
                      {gradientSteps.map((_, index) => {
                        return (
                          <div
                            key={index}
                            className={cnStatisticsTable('gradientStep')}
                            style={{ backgroundColor: getGradientColor(index + 1) }}
                          ></div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className={cnStatisticsTable('dot')} style={{ backgroundColor: color }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PanelWrapper>
  );
};

export default observer(StatisticsTable);
