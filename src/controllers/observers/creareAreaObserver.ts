import {
  Camera,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
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
  (camera: Camera, sphere: Mesh, container: Object3D, controls: any) =>
  (create$) => {
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
          container.add(_plane);
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

          _plane.visible = false;
          console.log(_plane);
          const _p1 = _plane?.points[0].multiplyScalar(0.9);
          const _p2 = _plane?.points[1].multiplyScalar(0.9);
          const _p3 = _plane?.points[2].multiplyScalar(0.9);
          const _p4 = _plane?.points[3].multiplyScalar(0.9);
          const _w = _p1.distanceTo(_p2);
          const _h = _p1.distanceTo(_p4);
          const geometry = new PlaneGeometry(_w, _h);
          const _pm = _p3.sub(_p1).multiplyScalar(0.5);
          const _pm2 = _p1.add(_pm);
          const material = new MeshBasicMaterial({
            color: 0xffff00,
            side: DoubleSide,
            map: new TextureLoader().load('./cg.png'),
          });
          const plane = new Mesh(geometry, material);
          plane.position.copy(_pm2);
          plane.lookAt(new Vector3(0, 0, 0));
          container.add(plane);
        }
      },
    });
  };
