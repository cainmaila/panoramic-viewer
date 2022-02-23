import {
  Group,
  Mesh,
  Raycaster,
  WebGLRenderer,
  PerspectiveCamera,
} from 'three';
import { take } from 'rxjs/operators';
import { pointerupObservable } from './observables/pointerupObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
const raycaster = new Raycaster();
export function addSpriteController(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  sphere: Mesh,
  container: Group,
  iconType: string,
  iconSize: number = 1,
  fun?: (meta: I_InfoNodeMeta) => void,
) {
  return pointerupObservable(renderer)
    .pipe(take(1))
    .subscribe((pointer) => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0) {
        const _point = intersects[0].point;
        _point.multiplyScalar(0.9);
        const sprite = new InfoNodeSprint(
          _point,
          null,
          iconType,
          iconSize,
          camera ? camera.fov / 75 : 1,
        );
        container.add(sprite);
        fun && fun(sprite.meta);
      }
    });
}
