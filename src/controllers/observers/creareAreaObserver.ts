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

export interface I_AddAreaMeshMessage {
  points: Vector3[];
  name: string;
}

export const creareAreaObserver =
  (camera: Camera, sphere: Mesh, scene: Scene, controls: any) => (create$) => {
    let _plane: AreaMesh | null;
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
        if (_plane) {
          const detail = <I_AddAreaMeshMessage>{
            points: _plane?.points,
            name: _plane.name,
          };
          window.dispatchEvent(new CustomEvent('addAreaComplete', { detail }));
        }
      },
    });
  };
