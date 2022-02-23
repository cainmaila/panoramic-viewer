import { take } from 'rxjs';
import { PerspectiveCamera, WebGLRenderer, Object3D, Mesh } from 'three';
import InfoNodeSprint from './customize/InfoNodeSprint';
import { pointerUpByRayObservable } from './observables/pointerupObservable';
export function editSprteController(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  sphere: Mesh,
  obj: Object3D,
  fun: Function | null = null,
) {
  return pointerUpByRayObservable(renderer, camera, sphere, 0)
    .pipe(take(1))
    .subscribe((pointer) => {
      if (!pointer) return;
      pointer.multiplyScalar(0.9);
      obj.position.copy(pointer);
      const _ob = obj as InfoNodeSprint;
      fun && fun(_ob.meta);
    });
}
