import { useEffect, useRef } from 'react';
import block from 'bem-cn';
import { observer } from 'mobx-react';

import { sceneStore } from 'stores';

import './ScenePage.scss';

const cnScenePage = block('ScenePage');

const ScenePage = () => {
  const sceneWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneWrapperRef.current) {
      sceneStore.initScene(sceneWrapperRef.current);
      sceneStore.initModel();
    }

    return () => {
      sceneStore.deInit();
    };
  }, [sceneWrapperRef.current]);

  useEffect(() => {
    const onResize = () => {
      if (sceneWrapperRef.current) {
        sceneStore.updateSceneSizes(
          sceneWrapperRef.current.clientWidth,
          sceneWrapperRef.current.clientHeight,
        );
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div className={cnScenePage()} ref={sceneWrapperRef}></div>;
};

export default observer(ScenePage);
