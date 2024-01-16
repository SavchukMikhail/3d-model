import { ReactNode } from 'react';
import block from 'bem-cn';

import './PanelWrapper.scss';

const cnPanelWrapper = block('PanelWrapper');

type TPanelWrapper = {
  children: ReactNode;
  className?: string;
};

const PanelWrapper = (props: TPanelWrapper) => {
  const { children, className } = props;

  return <div className={cnPanelWrapper.mix(className)}>{children}</div>;
};

export default PanelWrapper;
