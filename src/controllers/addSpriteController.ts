import { Raycaster } from 'three';
import { take } from 'rxjs/operators';
import { pointerupObservable } from './observables/pointerupObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
const raycaster = new Raycaster();
export function addSpriteController(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  sphere: THREE.Mesh,
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
        const sprite = new InfoNodeSprint(_point, iconType, iconSize);
        scene.add(sprite);
      }
    });
}
