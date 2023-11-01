import { Outlet } from 'react-router-dom';
import block from 'bem-cn';

import './RootLayout.scss';

const cnRootLayout = block('RootLayout');

const RootLayout = () => {
  return (
    <div className={cnRootLayout()}>
      <Outlet />
    </div>
  );
};

export default RootLayout;
