import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
/**
 * right pointerup Observable
 * @export
 * @param {THREE.WebGLRenderer} renderer
 * @return {*}
 */
export function pointerupObservable(renderer: THREE.WebGLRenderer) {
  return fromEvent(window, 'pointerup').pipe(
    filter((_e) => {
      const e = <PointerEvent>_e;
      return e.button === 2;
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
