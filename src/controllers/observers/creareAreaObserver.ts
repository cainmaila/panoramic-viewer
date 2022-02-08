import {
  Camera,
  DoubleSide,
  Line3,
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

          // const _po = new Vector3();
          // camera.getWorldDirection(_po);
          // console.log('xxx', camera.rotation, _plane.position);
          const geometry = new PlaneGeometry(
            _plane.points[0].distanceTo(_plane.points[1]) * 0.95,
            _plane.points[1].distanceTo(_plane.points[2]) * 0.95,
          );
          const texture = new TextureLoader().load('img.png');
          const material = new MeshBasicMaterial({
            // color: 0xff0000,
            side: DoubleSide,
            map: texture,
          });
          // console.log('xxxx', _plane.points);
          const a = new Line3(_plane.points[0], _plane.points[2]);
          let b = new Vector3();
          a.getCenter(b);
          b.multiplyScalar(0.9);
          // console.log('xxxx2', b);
          const plane = new Mesh(geometry, material);
          plane.position.copy(b);
          plane.rotation.copy(camera.rotation);
          container.add(plane);
        }
      },
    });
  };
