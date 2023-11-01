import { Outlet } from 'react-router-dom';
import block from 'bem-cn';

import './MainPage.scss';

const cnMainPage = block('MainPage');

const MainPage = () => {
  return (
    <div className={cnMainPage()}>
      <Outlet />
    </div>
  );
};

export default MainPage;
