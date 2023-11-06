import { useEffect, useRef } from 'react';
import block from 'bem-cn';
import { observer } from 'mobx-react';
import { Vector2 } from 'three';

import { sceneStore } from 'stores';

import './ScenePage.scss';

const cnScenePage = block('ScenePage');

const ScenePage = () => {
  const sceneWrapperRef = useRef<HTMLDivElement>(null);

  const checkIntersection = (e: PointerEvent) => {
    if (!sceneWrapperRef.current || !e.isPrimary) return;

    const x = (e.clientX / sceneWrapperRef.current.clientWidth) * 2 - 1;
    const y = -(e.clientY / sceneWrapperRef.current.clientHeight) * 2 + 1;

    sceneStore.checkIntersection(new Vector2(x, y));
  };

  useEffect(() => {
    if (sceneWrapperRef.current) {
      sceneStore.initScene(sceneWrapperRef.current);
      sceneStore.initModel();

      sceneWrapperRef.current.addEventListener('pointermove', checkIntersection);
    }

    return () => {
      sceneStore.deInit();

      if (sceneWrapperRef.current)
        sceneWrapperRef.current.removeEventListener('pointermove', checkIntersection);
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
