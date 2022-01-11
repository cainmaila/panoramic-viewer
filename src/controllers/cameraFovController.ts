// export function cameraFovController<T>(a: T, camera: THREE.PerspectiveCamera) {}

import { fromEvent } from 'rxjs';
import { map, startWith, scan, distinctUntilChanged } from 'rxjs/operators';

export function cameraFovController(camera: THREE.PerspectiveCamera) {
  const mousewheelObserver = fromEvent(window, 'mousewheel').pipe(
    map((_e) => {
      const e = <WheelEvent>_e;
      return e.deltaY > 0 ? 1 : -1;
    }),
    startWith(75), //camera.fov def
    scan((a: number, b: number) => {
      const _sum = a + b;
      return _sum >= 120 ? 120 : _sum <= 45 ? 45 : _sum;
    }),
    distinctUntilChanged(),
  );
  return mousewheelObserver.subscribe((_num: number) => {
    camera.fov = _num;
    camera.updateProjectionMatrix();
  });
}
