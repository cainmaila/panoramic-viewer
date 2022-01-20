import { fromEvent, map, scan, switchMap, takeUntil } from 'rxjs';
import { Renderer } from 'three';

export const selectAreaObserableByRenderer = (renderer: Renderer) =>
  fromEvent(window, 'pointerdown').pipe(
    switchMap(() => fromEvent(window, 'pointermove')),
    map((_e) => {
      const e = <PointerEvent>_e;
      return {
        x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
      };
    }),
    scan((ob, ob2) => {
      return {
        ...ob,
        x1: ob2.x,
        y1: ob2.y,
      };
    }),
    takeUntil(fromEvent(renderer.domElement, 'pointerup')),
    takeUntil(fromEvent(window, 'addArea')),
  );
