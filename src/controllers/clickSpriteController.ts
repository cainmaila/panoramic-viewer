import { Camera, Group, Mesh, Raycaster, WebGLRenderer } from 'three';
import InfoNodeSprint from './customize/InfoNodeSprint';
import { pointerupObservable } from './observables/pointerupObservable';
const raycaster = new Raycaster();
export function clickSpriteController(
  renderer: WebGLRenderer,
  camera: Camera,
  container: Group,
  fun?: (meta: I_InfoNodeMeta) => void,
) {
  return pointerupObservable(renderer).subscribe((pointer) => {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(container, true);
    if (intersects.length > 0) {
      const _infoNode = intersects.filter((res) => {
        return res && res.object;
      })[0];
      const sprite = _infoNode.object as InfoNodeSprint;
      fun && fun(sprite.meta);
    }
  });
}
