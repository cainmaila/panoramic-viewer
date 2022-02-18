import { connectable, fromEvent, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
/**
 * right pointerup Observable
 * @export
 * @param {THREE.WebGLRenderer} renderer
 * @return {*}
 */
export function pointerupObservable(
  renderer: THREE.WebGLRenderer,
  buttonType: number = 0,
) {
  return fromEvent(window, 'pointerup').pipe(
    filter((_e) => {
      const e = <PointerEvent>_e;
      return e.button === buttonType;
    }),
    map((_e) => {
      const e = <PointerEvent>_e;
      return {
        x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
      };
    }),
  );
}

export enum POINTER {
  LEFT,
  MID,
  RIGHT,
}

/**
 * pointerup Subject
 */

export const pointerup$ = connectable(fromEvent(window, 'pointerup'), {
  connector: () => new Subject(),
});

export const pointerUp$ = (pointer: POINTER = POINTER.LEFT) =>
  pointerup$.pipe(
    filter((_e) => {
      const e = <PointerEvent>_e;
      return e.button === pointer;
    }),
  );
