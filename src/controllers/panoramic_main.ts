import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Mesh,
  Group,
} from 'three';

import { fromEvent, map } from 'rxjs';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';
import { rendererResize } from './renderResizeController';
import { cameraFovController } from './cameraFovController';
import { addSpriteController } from './addSpriteController';
import { animationFrames$ } from './observables/animationFramesObservable';
import {
  saveMeshSubscription,
  loadMeshSubscription,
} from './meshDateSubscription';
import { clickMeshSubscription } from './clickMeshSubscription';

import { selectAreaObserableByRenderer } from './observables/selectAreaObserable';
import { creareAreaObserver } from './observers/creareAreaObserver';
import AreaMesh from './customize/AreaMesh';

class Panoramic {
  private _scene: Scene | undefined;
  private _camera: PerspectiveCamera | undefined;
  private _renderer: WebGLRenderer | undefined;
  private _sphereMaterial: MeshBasicMaterial | undefined;
  private _meshGroup: Group | undefined;
  unsubscribe: () => void;
  constructor() {
    this.unsubscribe = () => {};
  }
  create(view: Element | null) {
    if (!view) throw new Error('view can not null!');
    const scene = new Scene();
    this._scene = scene;
    const camera = new PerspectiveCamera(
      75,
      view.clientWidth / view.clientHeight,
      0.1,
      1000,
    );
    this._camera = camera;
    camera.position.set(1, 0, 0);
    const renderer = new WebGLRenderer();
    this._renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    view.appendChild(renderer.domElement);
    //demo
    const sphereGeometry = new SphereGeometry(500, 50, 50);
    sphereGeometry.scale(-1, 1, 1);
    const sphereMaterial = new MeshBasicMaterial();
    this._sphereMaterial = sphereMaterial;
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    //mesh Group
    this._meshGroup = new Group();
    scene.add(this._meshGroup);
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
    //add area
    const addAreaSubscription = fromEvent(window, 'addArea')
      .pipe(map(() => selectAreaObserableByRenderer(renderer)))
      .subscribe(creareAreaObserver(camera, sphere, this._meshGroup, controls));

    //load mesh
    loadMeshSubscription(this._meshGroup);
    //save mesh
    const saveMeshSubscription_ = saveMeshSubscription([]);
    //click mesh
    const clickMesh$ = clickMeshSubscription(renderer, camera, this._meshGroup);

    this.unsubscribe = () => {
      onResizeOb.unsubscribe();
      animationFramesSubscription.unsubscribe();
      cameraFovSubscription.unsubscribe();
      addSpritSubscription.unsubscribe();
      addAreaSubscription.unsubscribe();
      saveMeshSubscription_.unsubscribe();
      clickMesh$.unsubscribe();
    };
  }
  loadImage(_url: string) {
    this._sphereMaterial &&
      (this._sphereMaterial.map = new TextureLoader().load(_url));
  }
  addArea() {
    window.dispatchEvent(new Event('addArea'));
  }
  clearStore() {
    // window.dispatchEvent(new Event('clearStore'));
    localStorage.clear();
  }
  get scene() {
    return this._scene;
  }
  get camera() {
    return this._camera;
  }
  get renderer() {
    return this._renderer;
  }
}

export default Panoramic;
