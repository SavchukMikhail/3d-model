import { SyntheticEvent, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { dashboardStore } from 'stores';

import { DataImport, DataTable, StatisticsComponent } from './components';

import './DashboardPage.scss';

const cnDashboardPage = block('DashboardPage');

enum DashboardPageTabs {
  TableTab,
  StatisticsPage,
}

const tabs = [
  {
    key: DashboardPageTabs.TableTab,
    value: 'Таблица',
  },
  {
    key: DashboardPageTabs.StatisticsPage,
    value: 'Статистика',
  },
];

const DashboardPage = () => {
  const [currentTab, setCurrentTab] = useState<DashboardPageTabs | null>(null);

  const onChangeTab = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const onFileLoad = (file: File) => {
    dashboardStore.dataLoader.loadFile(file);
    setCurrentTab(DashboardPageTabs.TableTab);
  };

  const getTab = () => {
    switch (currentTab) {
      case DashboardPageTabs.StatisticsPage: {
        return <StatisticsComponent />;
      }
      case DashboardPageTabs.TableTab: {
        return (
          <DataTable
            isLoading={dashboardStore.dataLoader.isLoading}
            data={dashboardStore.dataLoader.tableData}
            columns={dashboardStore.dataLoader.tableHeader}
          />
        );
      }
      default: {
        return <DataImport onFileLoad={onFileLoad} />;
      }
    }
  };

  return (
    <div className={cnDashboardPage()}>
      <div className={cnDashboardPage('header')}>
        {currentTab === null ? (
          'Загрузите файл'
        ) : (
          <Tabs
            value={currentTab}
            onChange={onChangeTab}
            className={cnDashboardPage('tabs').toString()}
          >
            {tabs.map((tab) => (
              <Tab
                label={tab.value}
                value={tab.key}
                key={tab.key}
                className={cnDashboardPage('tab').toString()}
              />
            ))}
          </Tabs>
        )}
      </div>

      <div className={cnDashboardPage('content')}>{getTab()}</div>
    </div>
  );
};

export default observer(DashboardPage);
