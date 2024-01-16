import { useEffect } from 'react';
import { Grid } from '@mui/material';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { dashboardStore } from 'stores';

import { PanelWrapper } from 'components';

import JointLineChart from './components/JointLineChart/JointLineChart';
import { ActiveMusclesPieChart, PatientInfo, StatisticsTable } from './components';

import './StatisticsComponent.scss';

const cnStatisticsComponent = block('StatisticsComponent');

const StatisticsComponent = () => {
  useEffect(() => {
    return () => {
      dashboardStore.clearSelectedJoint();
    };
  }, []);

  return (
    <div className={cnStatisticsComponent()}>
      <Grid container spacing={2} className={cnStatisticsComponent('container').toString()}>
        <Grid
          item
          xs={2}
          height={dashboardStore.selectedJoint ? '40%' : '100%'}
          className={cnStatisticsComponent('item').toString()}
        >
          <PatientInfo />
        </Grid>

        <Grid
          item
          xs={10}
          height={dashboardStore.selectedJoint ? '40%' : '100%'}
          className={cnStatisticsComponent('item').toString()}
        >
          <StatisticsTable />
        </Grid>

        {dashboardStore.selectedJoint && (
          <>
            <Grid item xs={3} height={'60%'} className={cnStatisticsComponent('item').toString()}>
              <PanelWrapper>
                <ActiveMusclesPieChart />
              </PanelWrapper>
            </Grid>

            <Grid item xs={9} height={'60%'} className={cnStatisticsComponent('item').toString()}>
              <PanelWrapper>
                <JointLineChart />
              </PanelWrapper>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default observer(StatisticsComponent);
