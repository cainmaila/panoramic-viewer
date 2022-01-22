import { connectable, ObservableInput, Subject } from 'rxjs';
import { Camera, Mesh, Raycaster, Scene, Vector2, Vector3 } from 'three';
import AreaMesh from '../customize/AreaMesh';

const raycaster = new Raycaster();

const _raycasterSphereByCamera =
  (camera: Camera, sphere: Mesh) => (po: Vector2) => {
    raycaster.setFromCamera(po, camera);
    let intersects = raycaster.intersectObject(sphere);
    return intersects[0]?.point;
  };

// interface

export const creareAreaObserver =
  (camera: Camera, sphere: Mesh, scene: Scene, controls: any) =>
  (create: ObservableInput<Vector2[]>) => {
    let _plane: AreaMesh | null;
    const create$ = connectable(create, {
      connector: () => new Subject(),
    });

    create$.subscribe({
      next: (pointers: Vector2[]) => {
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
      complete: () => {
        controls.enabled = true;
      },
    });

    create$.connect();
  };
