import { fromEvent } from 'rxjs';
import { map, startWith, scan, distinctUntilChanged } from 'rxjs/operators';
import { Group } from 'three';
import InfoNodeSprint from './customize/InfoNodeSprint';

/**
 * camera Fov Controller
 * @export
 * @param {THREE.PerspectiveCamera} camera
 * @return {Subscription}
 */
export function cameraFovController(
  camera: THREE.PerspectiveCamera,
  _infoNodeContainer: Group,
) {
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
    (_infoNodeContainer?.children || []).forEach((_node) => {
      const _ob = _node as InfoNodeSprint;
      _ob.setFovScle(_num / 75); //TODO: 這不是一個好方法，架構也是...
    });
    camera.updateProjectionMatrix();
  });
}
