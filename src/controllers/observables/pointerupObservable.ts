import { connectable, fromEvent, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Camera, Object3D, Raycaster } from 'three';
/**
 * right pointerup Observable
 * @export
 * @param {THREE.WebGLRenderer} renderer
 * @return {*}
 */
export function pointerupObservable(
  renderer: THREE.WebGLRenderer,
  buttonType: number = -1, // if -1 就都傳 0左鍵 1中鍵 2右鍵
) {
  return fromEvent(window, 'pointerup').pipe(
    filter((_e) => {
      const e = <PointerEvent>_e;
      return buttonType === -1 ? true : e.button === buttonType;
    }),
    map((_e) => {
      const e = <PointerEvent>_e;
      return {
        x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
        button: e.button,
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

const raycaster = new Raycaster();
export const pointerUpByRayObservable = (
  renderer: THREE.WebGLRenderer,
  camera: Camera,
  sphere: Object3D,
  buttonType: number = 0,
) => {
  return pointerupObservable(renderer, buttonType).pipe(
    map((_po) => {
      raycaster.setFromCamera(_po, camera);
      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0) {
        return intersects[0].point;
      }
      return null;
    }),
    filter((_po) => {
      return !!_po;
    }),
  );
};
