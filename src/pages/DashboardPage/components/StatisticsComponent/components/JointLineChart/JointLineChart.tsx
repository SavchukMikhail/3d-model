import { useEffect, useRef, useState } from 'react';
import block from 'bem-cn';
import { observer } from 'mobx-react';
import { Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';

import { dashboardStore } from 'stores';

import './JointLineChart.scss';

const DATA_KEY = 'value';
const INDEX_KEY = 'index';

const cnJointLineChart = block('JointLineChart');

const JointLineChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const selectedJoint = dashboardStore.selectedJoint!;

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      setHeight(containerRef.current.offsetHeight);
    }
  }, [containerRef]);

  const chartData: any[] = selectedJoint.jointData.data.map((val, index) => {
    return {
      [DATA_KEY]: val,
      [INDEX_KEY]: index,
    };
  });

  return (
    <div className={cnJointLineChart()} ref={containerRef}>
      <LineChart
        width={width}
        height={height}
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 30,
          bottom: 20,
        }}
      >
        <XAxis
          label={{
            value: 'Номер точки',
            position: 'bottom',
          }}
          dataKey={INDEX_KEY}
          ticks={selectedJoint.xAxisTicks}
        />
        <YAxis
          label={{
            value: selectedJoint.name,
            style: { textAnchor: 'middle' },
            angle: -90,
            position: 'left',
            offset: 10,
          }}
          domain={[
            parseFloat(
              (
                Math.min(selectedJoint.jointData.min, selectedJoint.jointData.lcl) -
                selectedJoint.jointData.std * 0.5
              ).toFixed(2),
            ),
            parseFloat(
              (
                Math.max(selectedJoint.jointData.max, selectedJoint.jointData.ucl) +
                selectedJoint.jointData.std * 0.5
              ).toFixed(2),
            ),
          ]}
        />
        <Line type="monotone" dataKey={DATA_KEY} stroke="#8884d8" />

        <ReferenceLine
          y={selectedJoint.jointData.ucl}
          label={{
            value: `Верхняя граница: ${selectedJoint.jointData.ucl.toFixed(2)}`,
            dy: -16,
            position: 'insideRight',
          }}
          stroke="#82c7bd"
        />

        <ReferenceLine
          y={selectedJoint.jointData.mean + selectedJoint.jointData.std}
          label={{
            value: `(+) дисперсия: ${(
              selectedJoint.jointData.mean + selectedJoint.jointData.std
            ).toFixed(2)}`,
            dy: -16,
            position: 'insideRight',
          }}
          stroke="#82c7bd"
        />

        <ReferenceLine
          y={selectedJoint.jointData.mean}
          label={{
            value: `Среднее значение: ${selectedJoint.jointData.mean.toFixed(2)}`,
            dy: -16,
            position: 'insideRight',
          }}
          stroke="#82c7bd"
        />

        <ReferenceLine
          y={selectedJoint.jointData.mean - selectedJoint.jointData.std}
          label={{
            value: `(-) дисперсия: ${(
              selectedJoint.jointData.mean - selectedJoint.jointData.std
            ).toFixed(2)}`,
            dy: -16,
            position: 'insideRight',
          }}
          stroke="#82c7bd"
        />

        <ReferenceLine
          y={selectedJoint.jointData.lcl}
          label={{
            value: `Нижняя граница: ${selectedJoint.jointData.lcl.toFixed(2)}`,
            dy: -16,
            position: 'insideRight',
          }}
          stroke="#82c7bd"
        />

        {/*<Tooltip />*/}
        {/*<Legend />*/}
      </LineChart>
    </div>
  );
};

export default observer(JointLineChart);
