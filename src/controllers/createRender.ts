//棄用
// import { fromEvent } from 'rxjs';
// import {
//   map,
//   filter,
//   startWith,
//   scan,
//   distinctUntilChanged,
// } from 'rxjs/operators';
// import * as THREE from 'three';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Mesh,
} from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';
import { rendererResize } from './renderResizeController';
import { cameraFovController } from './cameraFovController';
import { addSpriteController } from './addSpriteController';
import { animationFrames$ } from './observables/animationFramesObservable';
/**
 * THREE renderer init
 * @param view
 * @returns
 */
export function sceneInit(view: Element | null): SceneInit {
  if (!view) throw new Error('view can not null!');
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    view.clientWidth / view.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(1, 0, 0);
  // const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
  // scene.add(light);
  const renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  view.appendChild(renderer.domElement);
  //demo

  const sphereGeometry = new SphereGeometry(500, 50, 50);
  sphereGeometry.scale(-1, 1, 1);
  const sphereMaterial = new MeshBasicMaterial({
    map: new TextureLoader().load('./pcx.jpg'),
  });
  const sphere = new Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  //controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = -0.2;
  controls.panSpeed = 0;
  controls.zoomSpeed = 0;
  controls.enableDamping = true;

  //resize
  const onResizeOb = rendererResize(view, renderer, camera);
  //animationFrames
  const animationFramesSubscription = animationFrames$.subscribe((_time) => {
    controls.update();
    renderer.render(scene, camera);
  });
  animationFrames$.connect();

  //zoom fov
  const cameraFovSubscription = cameraFovController(camera);

  //cast
  const addSpritSubscription = addSpriteController(
    renderer,
    camera,
    scene,
    sphere,
  );

  return {
    scene,
    camera,
    renderer,
    unsubscribe: () => {
      onResizeOb.unsubscribe();
      animationFramesSubscription.unsubscribe();
      cameraFovSubscription.unsubscribe();
      addSpritSubscription.unsubscribe();
    },
    loadImage(_url) {
      console.log(123, _url);
    },
  };
}

interface SceneInit {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  unsubscribe: Uload;
  loadImage: (url: string) => void;
}

interface Uload {
  (): void;
}
