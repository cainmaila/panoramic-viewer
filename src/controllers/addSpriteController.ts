import { Raycaster } from 'three';
import { pointerupObservable } from './observables/pointerupObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
const raycaster = new Raycaster();
export function addSpriteController(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  sphere: THREE.Mesh,
) {
  return pointerupObservable(renderer).subscribe((pointer) => {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(sphere);
    if (intersects.length > 0) {
      const _point = intersects[0].point;
      _point.multiplyScalar(0.9);
      const sprite = new InfoNodeSprint(_point, 'p1', 0.7);
      scene.add(sprite);
    }
  });
}
