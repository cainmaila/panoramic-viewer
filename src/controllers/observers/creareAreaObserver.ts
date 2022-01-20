import { Raycaster, Vector3 } from 'three';
import AreaMesh from '../customize/AreaMesh';
import { AreaPos } from '../observables/selectAreaObserable';

const raycaster = new Raycaster();

const _raycasterSphereByCamera = (camera, sphere) => (po) => {
  raycaster.setFromCamera(po, camera);
  let intersects = raycaster.intersectObject(sphere);
  return intersects[0]?.point;
};

export const creareAreaObserver =
  (camera, sphere, scene, controls) => (create$) => {
    let _plane: AreaMesh | null;
    create$.subscribe({
      next: (pointers: AreaPos[]) => {
        controls.enabled = false;
        const raycasterSphere = _raycasterSphereByCamera(camera, sphere);
        const _arr: Vector3[] = [];
        pointers.forEach((pointer) => {
          _arr.push(raycasterSphere(pointer));
        });
        if (_plane) {
          _plane.reDraw(_arr);
        } else {
          _plane = new AreaMesh(_arr);
          scene.add(_plane);
        }
      },
      complete: (a) => {
        controls.enabled = true;
      },
    });
  };
