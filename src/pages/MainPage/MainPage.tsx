import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import block from 'bem-cn';

import patientsStore from 'stores/patientsStore';

import { MainPageHeader, PatientsList } from './components';

import './MainPage.scss';

const cnMainPage = block('MainPage');

const MainPage = () => {
  useEffect(() => {
    patientsStore.getPatients();

    return () => {
      patientsStore.deInit();
    };
  }, []);

  return (
    <div className={cnMainPage()}>
      <Box className={cnMainPage('header').toString()}>
        <MainPageHeader />
      </Box>

      <Box className={cnMainPage('pageContent').toString()}>
        <Stack className={cnMainPage('patientsList').toString()}>
          <PatientsList />
        </Stack>

        <Box className={cnMainPage('userContent').toString()}></Box>
      </Box>
    </div>
  );
};

export default MainPage;
