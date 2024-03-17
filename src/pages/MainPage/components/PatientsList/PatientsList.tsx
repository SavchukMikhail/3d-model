import { ChangeEvent } from 'react';
import { List, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import patientsStore from 'stores/patientsStore';

import './PatientsList.scss';

const cnPatientsList = block('PatientsList');

const PatientsList = () => {
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    patientsStore.setSearchValue(event.target.value);
  };

  return (
    <>
      <TextField
        className={cnPatientsList('searchInput').toString()}
        id="outlined-basic"
        label="Поиск по пациентам"
        variant="outlined"
        name="searchInput"
        size={'small'}
        value={patientsStore.searchValue}
        onChange={onChangeSearchValue}
      />

      {patientsStore.filteredPatients.length ? (
        <List
          className={cnPatientsList().toString()}
          component="nav"
          aria-label="secondary mailbox folder"
        >
          {patientsStore.filteredPatients.map((patient) => {
            const onClick = () => {
              patientsStore.selectPatient(patient.id);
            };

            return (
              <ListItemButton
                key={patient.id}
                className={cnPatientsList('patient').toString()}
                selected={patientsStore.selectedPatientId === patient.id}
                onClick={onClick}
              >
                <ListItemText primary={patient.username} />
              </ListItemButton>
            );
          })}
        </List>
      ) : (
        <Typography>Нет данных</Typography>
      )}
    </>
  );
};

export default observer(PatientsList);
