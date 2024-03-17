import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField } from '@mui/material';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { authStore } from 'stores';

import { Loader } from 'components';
import { RouterPathEnum } from 'shared';

import './LoginPage.scss';

const cnLoginPage = block('LoginPage');

const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
  authStore.setUsername(event.target.value);
};

const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
  authStore.setPassword(event.target.value);
};

const LoginPage = () => {
  const navigate = useNavigate();

  const authorize = async () => {
    await authStore.signIn();

    if (authStore.currentUser) navigate(RouterPathEnum.Main);
  };

  return (
    <Box className={cnLoginPage.toString()}>
      <Loader visible={authStore.isLoading} />

      <Stack
        className={cnLoginPage('form').toString()}
        direction={'column'}
        gap={4}
        padding={4}
        borderRadius={2}
      >
        <TextField
          label="Username"
          value={authStore.username}
          onChange={onChangeUsername}
        ></TextField>

        <TextField
          label="Password"
          type={'password'}
          value={authStore.password}
          onChange={onChangePassword}
        ></TextField>

        <Button variant="contained" onClick={authorize}>
          Sign in
        </Button>
      </Stack>
    </Box>
  );
};

export default observer(LoginPage);
