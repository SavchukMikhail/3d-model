import { ChangeEvent, DragEvent, useRef } from 'react';
import block from 'bem-cn';

import { DragNDropEvents } from 'shared';

import './DataImport.scss';

const cnDataImport = block('DataImport');

type TDataImportProps = {
  onFileLoad(file: File): void;
};

const DataImport = (props: TDataImportProps) => {
  const { onFileLoad } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const eventHandlerFunction = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.type) {
      case DragNDropEvents.DragOver: {
        break;
      }
      case DragNDropEvents.DragEnter: {
        break;
      }
      case DragNDropEvents.DragLeave: {
        break;
      }
      case DragNDropEvents.Drop: {
        const dt = event.dataTransfer;
        const files = dt.files;

        onFileLoad(files[0]);
        break;
      }
    }
  };

  const onClick = () => {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.length) {
      onFileLoad(files[0]);
    }
  };

  return (
    <div
      className={cnDataImport()}
      onDrop={eventHandlerFunction}
      onDragEnter={eventHandlerFunction}
      onDragOver={eventHandlerFunction}
      onDragLeave={eventHandlerFunction}
      onClick={onClick}
    >
      <input type="file" hidden accept={'.csv'} ref={fileInputRef} onChange={onChange} />

      <p className={cnDataImport('text')}>Drop your file / Click here</p>
    </div>
  );
};

export default DataImport;
