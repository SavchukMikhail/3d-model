import React from 'react';
import block from 'bem-cn';

import './Loader.scss';

const cnLoader = block('Loader');

type LoaderProps = {
  visible?: boolean;
  className?: string;
};

const Loader = (props: LoaderProps) => {
  const { className, visible } = props;

  return (
    <div className={cnLoader({ visible }).mix(className)}>
      <div className={cnLoader('dots')}>
        <span className={cnLoader('dot')}></span>
        <span className={cnLoader('dot')}></span>
        <span className={cnLoader('dot')}></span>
      </div>
    </div>
  );
};

export default Loader;
