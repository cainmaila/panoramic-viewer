import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Mesh,
  Vector3,
  Raycaster,
  Vector2,
  SpriteMaterial,
  Sprite,
} from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';
import { rendererResize } from './renderResizeController';
import { cameraFovController } from './cameraFovController';
import { addSpriteController } from './addSpriteController';
import { animationFrames$ } from './observables/animationFramesObservable';
import AreaMesh from './customize/AreaMesh';
import {
  asyncScheduler,
  fromEvent,
  map,
  mergeAll,
  observeOn,
  pluck,
  repeat,
  repeatWhen,
  scan,
  Scheduler,
  switchAll,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

interface Pos {
  x: number;
  y: number;
  x1: number;
  y1: number;
}

class Panoramic {
  private _scene: Scene | undefined;
  private _camera: PerspectiveCamera | undefined;
  private _renderer: WebGLRenderer | undefined;
  private _sphereMaterial: MeshBasicMaterial | undefined;
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

    this.unsubscribe = () => {
      onResizeOb.unsubscribe();
      animationFramesSubscription.unsubscribe();
      cameraFovSubscription.unsubscribe();
      addSpritSubscription.unsubscribe();
    };
    //================================================================

    const raycaster = new Raycaster();
    let _point: Vector3 | null = null;
    const material = new SpriteMaterial({
      map: new TextureLoader().load('placeholder.png'),
    });
    material.sizeAttenuation = false;
    let _plane: AreaMesh | null;

    fromEvent(window, 'addArea')
      .pipe(
        tap(() => {
          _plane = null;
          controls.enabled = false;
        }),
        map(() =>
          fromEvent(window, 'pointerdown').pipe(
            switchMap(() => fromEvent(window, 'pointermove')),
            map((_e) => {
              const e = <PointerEvent>_e;
              return {
                x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
                y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
              };
            }),
            scan((ob, ob2) => {
              return {
                ...ob,
                x1: ob2.x,
                y1: ob2.y,
              };
            }),
            takeUntil(fromEvent(renderer.domElement, 'pointerup')),
          ),
        ),
      )
      .subscribe((create$) => {
        create$.subscribe({
          next: (a) => {
            const pointer = <Pos>a;
            const p0 = new Vector2(pointer.x, pointer.y);
            const p1 = new Vector2(pointer.x1, pointer.y);
            const p2 = new Vector2(pointer.x1, pointer.y1);
            const p3 = new Vector2(pointer.x, pointer.y1);
            raycaster.setFromCamera(p0, camera);
            let intersects = raycaster.intersectObject(sphere);
            const _arr: Vector3[] = [];
            if (intersects.length > 0) {
              _arr.push(intersects[0].point);
            }
            raycaster.setFromCamera(p1, camera);
            intersects = raycaster.intersectObject(sphere);
            if (intersects.length > 0) {
              _arr.push(intersects[0].point);
            }
            raycaster.setFromCamera(p2, camera);
            intersects = raycaster.intersectObject(sphere);
            if (intersects.length > 0) {
              _arr.push(intersects[0].point);
            }
            raycaster.setFromCamera(p3, camera);
            intersects = raycaster.intersectObject(sphere);
            if (intersects.length > 0) {
              _arr.push(intersects[0].point);
            }
            if (_plane) {
              _plane.reDraw(_arr);
            } else {
              _plane = new AreaMesh(_arr);
              scene.add(_plane);
            }
          },
          complete: () => {
            controls.enabled = true;
          },
        });
      });
  }
  loadImage(_url: string) {
    this._sphereMaterial &&
      (this._sphereMaterial.map = new TextureLoader().load(_url));
  }
  addArea() {
    window.dispatchEvent(new Event('addArea'));
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
