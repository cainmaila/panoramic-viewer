import { Raycaster, Vector2, Vector3 } from 'three';
import AreaMesh from '../customize/AreaMesh';
import { AreaPos } from '../observables/selectAreaObserable';

const raycaster = new Raycaster();

export const creareAreaObserver =
  (camera, sphere, scene, controls) => (create$) => {
    let _plane: AreaMesh | null;
    create$.subscribe({
      next: (pointers: AreaPos[]) => {
        controls.enabled = false;
        const p0 = pointers[0];
        const p1 = pointers[1];
        const p2 = pointers[2];
        const p3 = pointers[3];
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
