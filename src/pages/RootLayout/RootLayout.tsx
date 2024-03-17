import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { authStore } from 'stores';

import { RouterPathEnum } from 'shared';

import './RootLayout.scss';

const cnRootLayout = block('RootLayout');

const RootLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthorized = authStore.checkIsAuthorized();

    if (!isAuthorized) navigate(RouterPathEnum.Auth);
  }, []);

  useEffect(() => {
    if (!authStore.currentUser) navigate(RouterPathEnum.Auth);
  }, [authStore.currentUser]);

  return (
    <div className={cnRootLayout()}>
      <Outlet />
    </div>
  );
};

export default observer(RootLayout);
