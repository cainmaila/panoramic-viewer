import { Group, Mesh, WebGLRenderer, PerspectiveCamera } from 'three';
import { take } from 'rxjs/operators';
import { pointerUpByRayObservable } from './observables/pointerupObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
export function addSpriteController(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  sphere: Mesh,
  container: Group,
  uuid: string | null,
  iconType: string,
  iconSize: number = 1,
  fun?: (meta: I_InfoNodeMeta) => void,
) {
  return pointerUpByRayObservable(renderer, camera, sphere, 0)
    .pipe(take(1))
    .subscribe((pointer) => {
      if (!pointer) return;
      pointer.multiplyScalar(0.9);
      const sprite = new InfoNodeSprint(
        pointer,
        uuid,
        iconType,
        iconSize,
        camera ? camera.fov / 75 : 1,
      );
      container.add(sprite);
      fun && fun(sprite.meta);
    });
}
