import { map } from 'rxjs';
import { Renderer, Vector2 } from 'three';
import { pointerSelect$, I_Select } from './pointerSelectObservable';

/**
 * 建立一個範圍選取 Observable
 * @param renderer 要綁定的 renderer
 * @returns Observable
 */
export const selectAreaObserableByRenderer = (renderer: Renderer) =>
  pointerSelect$.pipe(
    map((_select) => {
      const _clientWidth = renderer.domElement.clientWidth;
      const _clientHeight = renderer.domElement.clientHeight;
      return {
        x: (_select.x / _clientWidth) * 2 - 1,
        y: -(_select.y / _clientHeight) * 2 + 1,
        x1: (_select.x1 / _clientWidth) * 2 - 1,
        y1: -(_select.y1 / _clientHeight) * 2 + 1,
      };
    }),
    map((pointer: I_Select) => _toAreaArr(pointer)),
  );

function _toAreaArr(pointer: I_Select): Vector2[] {
  return [
    new Vector2(pointer.x, pointer.y),
    new Vector2(pointer.x1, pointer.y),
    new Vector2(pointer.x1, pointer.y1),
    new Vector2(pointer.x, pointer.y1),
  ];
}
