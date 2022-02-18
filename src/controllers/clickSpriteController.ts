import { Camera, Group, Mesh, Raycaster, WebGLRenderer } from 'three';
import { pointerupObservable } from './observables/pointerupObservable';
const raycaster = new Raycaster();
export function clickSpriteController(
  renderer: WebGLRenderer,
  camera: Camera,
  container: Group,
) {
  return pointerupObservable(renderer).subscribe((pointer) => {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(container, true);
    if (intersects.length > 0) {
      const _infoNode = intersects.filter((res) => {
        return res && res.object;
      })[0];
      const sprite = _infoNode.object;
      window.dispatchEvent(
        new CustomEvent<{
          id: string;
          position: { x: number; y: number; z: number };
        }>('click-infoNode', {
          detail: { id: sprite.name, position: sprite.position },
        }),
      );
    }
  });
}
