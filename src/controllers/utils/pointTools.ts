import { Camera, Object3D, Raycaster, Vector2, Vector3 } from 'three';

/**
 * 螢幕位置傳換為螢幕比例
 * @param _po
 * @param domElement
 * @returns
 */
export const pointToV3 = (domElement: Element) => (_po: I_Po) =>
  new Vector2(
    (_po.x / domElement.clientWidth) * 2 - 1,
    -(_po.y / domElement.clientHeight) * 2 + 1,
  );

const raycaster = new Raycaster();
/**
 * 碰撞
 * @param camera
 * @param container
 * @returns
 */
export const pointRaycaster =
  (camera: Camera, container: Object3D) =>
  (_vpo: I_Po): Object3D | undefined => {
    raycaster.setFromCamera(_vpo, camera);
    if (container) {
      let intersects = raycaster.intersectObject(container);
      return intersects[0]?.object;
    }
    return undefined;
  };

/**
 * 3d轉2d
 * @param po3 - 3D位置
 * @param camera - 映射攝影機
 * @param domElement - Viewer
 * @param container - 容器
 * @returns
 */
export const d3To2 = (
  { x, y, z }: { x: number; y: number; z: number },
  camera: Camera,
  domElement: Element,
  container: Object3D | null = null,
): { x: number; y: number } => {
  const po3 = new Vector3(x, y, z);
  const _po: Vector3 = container
    ? po3.setFromMatrixPosition(container.matrixWorld).project(camera)
    : po3.project(camera);
  const w = domElement.clientWidth / 2;
  const h = domElement.clientHeight / 2;
  return {
    x: w * _po.x + w,
    y: h * _po.y + h,
  };
};
