import { Raycaster, Vector2, Vector3 } from 'three';
import AreaMesh from '../customize/AreaMesh';

interface AreaPos {
  x: number;
  y: number;
  x1: number;
  y1: number;
}
const raycaster = new Raycaster();
export const creareAreaObserver =
  (camera, sphere, scene, controls) => (create$) => {
    let _plane: AreaMesh | null;
    create$.subscribe({
      next: (a) => {
        controls.enabled = false;
        const pointer = <AreaPos>a;
        const p0 = new Vector2(pointer.x, pointer.y);
        const p1 = new Vector2(pointer.x1, pointer.y);
        const p2 = new Vector2(pointer.x1, pointer.y1);
        const p3 = new Vector2(pointer.x, pointer.y1);
        raycaster.setFromCamera(p0, camera);
        let intersects = raycaster.intersectObject(sphere);
        const _arr: Vector3[] = [];
        if (intersects.length > 0) {
          _arr.push(intersects[0].point);
        }
        raycaster.setFromCamera(p1, camera);
        intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
          _arr.push(intersects[0].point);
        }
        raycaster.setFromCamera(p2, camera);
        intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
          _arr.push(intersects[0].point);
        }
        raycaster.setFromCamera(p3, camera);
        intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
          _arr.push(intersects[0].point);
        }
        if (_plane) {
          _plane.reDraw(_arr);
        } else {
          _plane = new AreaMesh(_arr);
          scene.add(_plane);
        }
      },
      complete: () => {
        controls.enabled = true;
      },
    });
  };
