import { Camera, Group, Mesh, Raycaster, WebGLRenderer, Scene } from 'three';
import { take } from 'rxjs/operators';
import { pointerupObservable } from './observables/pointerupObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
const raycaster = new Raycaster();
export function addSpriteController(
  renderer: WebGLRenderer,
  camera: Camera,
  sphere: Mesh,
  container: Group,
  iconType: string,
  iconSize: number = 1,
) {
  return pointerupObservable(renderer)
    .pipe(take(1))
    .subscribe((pointer) => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0) {
        const _point = intersects[0].point;
        _point.multiplyScalar(0.9);
        const sprite = new InfoNodeSprint(_point, null, iconType, iconSize);
        container.add(sprite);
        window.dispatchEvent(
          new CustomEvent<{
            id: string;
            iconType: string;
            iconSize: number;
            position: { x: number; y: number; z: number };
          }>('add-infoNode', {
            detail: { id: sprite.name, iconType, iconSize, position: _point },
          }),
        );
      }
    });
}
