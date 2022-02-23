import { fromEvent } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { PerspectiveCamera } from 'three';

/**
 * camera Fov Controller
 * @export
 * @param {THREE.PerspectiveCamera} camera
 * @return {Subscription}
 */
export function cameraFovController(
  camera: PerspectiveCamera,
  setCameraFov: (fov: number) => void,
) {
  const mousewheelObserver = fromEvent(window, 'mousewheel').pipe(
    map((_e) => {
      const e = <WheelEvent>_e;
      return e.deltaY > 0 ? 1 : -1;
    }),
    map((_num) => {
      return camera.fov + _num;
    }),
    map((fov) => {
      return fov >= 120 ? 120 : fov <= 45 ? 45 : fov;
    }),
    distinctUntilChanged(),
  );
  return mousewheelObserver.subscribe(setCameraFov);
}
