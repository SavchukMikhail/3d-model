import { TableVirtuoso } from 'react-virtuoso';
import block from 'bem-cn';

import { Loader } from 'components/CommonComponents';

import './DataTable.scss';

const cnDataTable = block('DataTable');

type TDataTableProps = {
  columns: string[];
  data: number[][];
  className?: string;
  isLoading?: boolean;
};

const DataTable = (props: TDataTableProps) => {
  const { columns, data, className, isLoading } = props;

  return (
    <div className={cnDataTable.mix(className)}>
      <Loader visible={isLoading} />

      <TableVirtuoso
        data={data}
        fixedHeaderContent={() => (
          <tr>
            {columns.map((column, index) => (
              <th
                style={{
                  width: '200px',
                }}
                key={column}
                className={cnDataTable('headerCell', { isFirst: index === 0 })}
              >
                <div className={cnDataTable('verticalLine', { isHidden: index < 2 })} />

                {column}
              </th>
            ))}
          </tr>
        )}
        itemContent={(index, row) => (
          <>
            {row.map((val, valIndex) => (
              <td
                height={60}
                key={index + valIndex}
                className={cnDataTable('dataCell', { isFirst: valIndex === 0 })}
              >
                <div className={cnDataTable('verticalLine', { isHidden: valIndex < 2 })} />

                {val}
              </td>
            ))}
          </>
        )}
      />
    </div>
  );
};

export default DataTable;
