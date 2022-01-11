import { onResizeObservable } from './observables/resizeObservable';

/**
 * renderer onResize
 * @param view
 * @param renderer
 * @returns
 */
export const rendererResize = (
  view: Element,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
) => {
  resize();
  return onResizeObservable.subscribe(resize);
  function resize() {
    camera.aspect = view.clientWidth / view.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(view.clientWidth, view.clientHeight);
  }
};
