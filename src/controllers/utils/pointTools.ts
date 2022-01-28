import { Camera, Object3D, Raycaster, Vector2 } from 'three';

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
