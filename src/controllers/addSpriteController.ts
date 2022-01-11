import { Raycaster, SpriteMaterial, TextureLoader, Sprite } from 'three';
import { pointerupObservable } from './observables/pointerupObservable';
const raycaster = new Raycaster();
const material = new SpriteMaterial({
  map: new TextureLoader().load('placeholder.png'),
});
material.sizeAttenuation = false;
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
      const sprite = new Sprite(material);
      sprite.scale.set(0.07, 0.07, 1);
      sprite.center.y = 0;
      sprite.position.copy(_point);
      scene.add(sprite);
    }
  });
}
