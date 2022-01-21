import { fromEvent, map, scan, switchMap, takeUntil } from 'rxjs';
import { Renderer, Vector2 } from 'three';
export interface AreaPos {
  x: number;
  y: number;
  x1?: number;
  y1?: number;
}

const mapPointerEventToAreaArr = map((_pointer) => {
  const pointer = <AreaPos>_pointer;
  return [
    new Vector2(pointer.x, pointer.y),
    new Vector2(pointer.x1, pointer.y),
    new Vector2(pointer.x1, pointer.y1),
    new Vector2(pointer.x, pointer.y1),
  ];
});

/**
 * 建立一個範圍選取 Observable
 * @param renderer 要綁定的 renderer
 * @returns Observable
 */
export const selectAreaObserableByRenderer = (renderer: Renderer) =>
  fromEvent(window, 'pointerdown').pipe(
    switchMap(() => fromEvent(window, 'pointermove')),
    map((_e): AreaPos => {
      const e = <PointerEvent>_e;
      return {
        x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
      };
    }),
    scan((ob: AreaPos, ob2: AreaPos): AreaPos => {
      return {
        ...ob,
        x1: ob2.x,
        y1: ob2.y,
      };
    }),
    mapPointerEventToAreaArr,
    takeUntil(fromEvent(renderer.domElement, 'pointerup')),
    takeUntil(fromEvent(window, 'addArea')),
  );
