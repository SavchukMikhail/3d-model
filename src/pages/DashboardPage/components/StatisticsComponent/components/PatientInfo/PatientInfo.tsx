import block from 'bem-cn';
import { observer } from 'mobx-react';

import { PanelWrapper } from 'components';

import './PatientInfo.scss';

const cnPatientInfo = block('PatientInfo');

const PatientInfo = () => {
  return (
    <PanelWrapper className={cnPatientInfo()}>
      <>Patient INFO</>
    </PanelWrapper>
  );
};

export default observer(PatientInfo);
