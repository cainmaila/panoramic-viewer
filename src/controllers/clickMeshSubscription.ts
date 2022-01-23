import { filter, fromEvent, map } from 'rxjs';
import { Camera, Object3D, Raycaster, Renderer, Vector2 } from 'three';
import AreaMesh from './customize/AreaMesh';

const raycaster = new Raycaster();
export const clickMeshSubscription = (
  renderer: Renderer,
  camera: Camera,
  container: Object3D,
) =>
  fromEvent(window, 'pointerup')
    .pipe(
      map((_e) => {
        const e = <PointerEvent>_e;
        return new Vector2(
          (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
          -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
        );
      }),
      map((_po) => {
        raycaster.setFromCamera(_po, camera);
        if (container) {
          let intersects = raycaster.intersectObject(container);
          return <AreaMesh>intersects[0]?.object;
        }
        return null;
      }),
      filter((_mesh) => !!_mesh),
    )
    .subscribe((_mesh) => {
      // alert('點選: ' + _mesh?.name);
    });
