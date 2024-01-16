import { useEffect, useRef, useState } from 'react';
import block from 'bem-cn';
import { observer } from 'mobx-react';
import { Cell, Pie, PieChart } from 'recharts';

import { dashboardStore } from 'stores';

import './ActiveMusclesPieChart.scss';

const cnActiveMusclesPieChart = block('ActiveMusclesPieChart');

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: any) => {
  const { name, cx, cy, midAngle, innerRadius, maxRadius, outerRadius } = props;

  const radius = innerRadius + ((maxRadius + outerRadius) / 2 - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      pointerEvents={'none'}
      transform={`translate(${x}, ${y}) rotate(${(x > cx ? 0 : 180) - midAngle})`}
      fill="#f5f5f5"
      stroke="#333333"
      strokeWidth={3}
      textAnchor={'middle'}
      paintOrder={'stroke'}
      offset={10}
      fontSize={11}
      dominantBaseline="central"
    >
      {name}
    </text>
  );
};

const ActiveMusclesPieChart = () => {
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

  return (
    <div className={cnActiveMusclesPieChart()} ref={containerRef}>
      <PieChart width={width} height={height}>
        <Pie
          data={selectedJoint.pieChartData.data}
          cx="50%"
          cy="50%"
          outerRadius={Math.min(width, height) * 0.4}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
          animationBegin={0}
          animationDuration={1000}
        >
          {selectedJoint.pieChartData.data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                selectedJoint.pieChartData.colors[index % selectedJoint.pieChartData.colors.length]
              }
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default observer(ActiveMusclesPieChart);
