// import { Subject, connectable } from 'rxjs';
// import { map } from 'rxjs/operators';
import * as THREE from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';
import { rendererResize } from './renderResizeController';
import { animationFrames$ } from './observables/animationFramesObservable';
/**
 * THREE renderer init
 * @param view
 * @returns
 */
export function sceneInit(view: Element | null): SceneInit {
  if (!view) throw new Error('view can not null!');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    view.clientWidth / view.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;
  const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
  scene.add(light);
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  view.appendChild(renderer.domElement);
  //demo
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //controls
  const controls = new OrbitControls(camera, renderer.domElement);

  //resize
  const onResizeOb = rendererResize(view, renderer, camera);
  //animationFrames
  const animationFramesSubscription = animationFrames$.subscribe((_time) => {
    controls.update();
    renderer.render(scene, camera);
  });
  animationFrames$.connect();
  return {
    scene,
    camera,
    renderer,
    unsubscribe: () => {
      onResizeOb.unsubscribe();
      animationFramesSubscription.unsubscribe();
    },
  };
}

interface SceneInit {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  unsubscribe: Uload;
}

interface Uload {
  (): void;
}
