import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Mesh,
  Group,
  Object3D,
  Vector3,
} from 'three';

import { Subscription } from 'rxjs';

import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls';
import { rendererResize } from './renderResizeController';
import { cameraFovController } from './cameraFovController';
import { addSpriteController } from './addSpriteController';
import { clickSpriteController } from './clickSpriteController';
import { animationFrames$ } from './observables/animationFramesObservable';
import InfoNodeSprint from './customize/InfoNodeSprint';
import EventEmitter from './customize/EventEmitter';
import { d3To2 } from './utils/pointTools';
import { animate, easeOut } from 'popmotion';
import { editSprteController } from './editSprteController';

const _v3: Vector3 = new Vector3();
class Panoramic extends EventEmitter {
  private _scene: Scene | undefined;
  private _camera: PerspectiveCamera | undefined;
  private _renderer: WebGLRenderer | undefined;
  private _sphereMaterial: MeshBasicMaterial | undefined;
  private _mainSubscription: Subscription | undefined | null;
  unsubscribe: () => void;
  private _mode: I_PanoramicMode | undefined | null;
  private _sphere: Mesh<SphereGeometry, MeshBasicMaterial> | undefined;
  private _infoNodeContainer: Group;
  constructor() {
    super();
    this._infoNodeContainer = new Group();
    this.unsubscribe = () => {};
  }
  set mode(val) {
    this._mainSubscription && this._mainSubscription.unsubscribe();
    this._mode = val;
    if (!this._renderer) throw new Error('no renderer');
    if (!this._camera) throw new Error('no camera');
    const uuid = this._mode?.params.uuid ? '' + this._mode.params.uuid : null;
    let _obj: Object3D | null | undefined;
    switch (this._mode?.state) {
      case 'addInfoNode': //add infoNode
        if (!this._sphere) throw new Error('no sphere');
        this._mainSubscription = addSpriteController(
          this._renderer,
          this._camera,
          this._sphere,
          this._infoNodeContainer,
          uuid,
          this._mode.params.iconType,
          this._mode.params.iconSize,
          (meta) => this.emit('add-infoNode', meta),
        );
        break;
      case 'editInfoNode': //edit info
        if (!this._sphere) throw new Error('no sphere');
        _obj = this._infoNodeContainer.getObjectByName(this._mode.params.id);
        _obj &&
          (this._mainSubscription = editSprteController(
            this._renderer,
            this._camera,
            this._sphere,
            _obj,
            (meta) => this.emit('edit-infoNode', meta),
          ));
        break;
      default:
        this._mainSubscription = clickSpriteController(
          this._renderer,
          this._camera,
          this._infoNodeContainer,
          (meta, pointer) =>
            this.emit('click-infoNode', { ...meta, button: pointer.button }),
        );
    }
  }
  get mode() {
    return this._mode;
  }
  get infoNodes() {
    const _metas: I_InfoNodeMeta[] = [];
    this._infoNodeContainer.children.forEach((_node: Object3D) => {
      const node = _node as InfoNodeSprint;
      _metas.push(node.meta);
    });
    return _metas;
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
    //create sphere
    const sphereGeometry = new SphereGeometry(500, 50, 50);
    sphereGeometry.scale(-1, 1, 1);
    const sphereMaterial = new MeshBasicMaterial();
    this._sphereMaterial = sphereMaterial;
    const sphere = new Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    this._sphere = sphere;
    //addInfoNode Container
    scene.add(this._infoNodeContainer);
    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = -0.2;
    controls.panSpeed = 0;
    controls.zoomSpeed = 0;
    controls.enableDamping = true;
    //resize
    const onResizeOb = rendererResize(view, renderer, camera);
    //animationFrames;
    const animationFramesSubscription = animationFrames$.subscribe((_time) => {
      controls.update();
      renderer.render(scene, camera);
    });
    animationFrames$.connect();
    //zoom fov
    const cameraFovSubscription = cameraFovController(
      camera,
      this._infoNodeContainer,
    );

    this.unsubscribe = () => {
      onResizeOb.unsubscribe();
      animationFramesSubscription.unsubscribe();
      cameraFovSubscription.unsubscribe();
      this._mainSubscription && this._mainSubscription.unsubscribe();
    };

    let _node: InfoNodeSprint | null = null;
    setInterval(() => {
      _node = (this._infoNodeContainer.children[0] as InfoNodeSprint) || null;
    }, 10);
    //================================================================
  }
  loadImage(_url: string) {
    this._sphereMaterial &&
      (this._sphereMaterial.map = new TextureLoader().load(_url));
  }
  delInfoNode(id: string) {
    const _infoNode = this._infoNodeContainer.getObjectByName(id);
    if (_infoNode) {
      this._infoNodeContainer.remove(_infoNode);
      this.emit('del-infoNode', id);
    }
  }
  changeIconType(id: string, iconType: string, size: number | undefined): void {
    const _infoNode = this._infoNodeContainer.getObjectByName(
      id,
    ) as InfoNodeSprint;
    _infoNode && (_infoNode.iconType = iconType);
    size && (_infoNode.size = size);
  }
  loolAtInfoNode(
    id: string,
    setting: { duration?: number } = {},
    callBack: Function,
  ): void {
    if (!this._camera) return;
    const _obj = this._infoNodeContainer.getObjectByName(id);
    if (!_obj) return;
    const duration = setting.duration || 1000;
    _v3.copy(_obj.position).normalize().negate();
    animate({
      from: this._camera.position,
      to: _v3,
      duration,
      ease: easeOut,
      onUpdate: (latest) => {
        this._camera && this._camera.position.copy(latest);
      },
      onComplete() {
        callBack && callBack();
      },
    });
  }
  clearInfoNodes() {
    while (this._infoNodeContainer.children.length) {
      this._infoNodeContainer.remove(this._infoNodeContainer.children[0]);
    }
  }
  setInfoNodes(_nodeMetas: I_InfoNodeMeta[]) {
    this.clearInfoNodes();
    _nodeMetas.forEach((_node) => {
      const sprite = new InfoNodeSprint(
        _node.position,
        _node.id,
        _node.iconType,
        _node.iconSize,
      );
      this._infoNodeContainer.add(sprite);
    });
  }
  project(xyz: { x: number; y: number; z: number }): { x: number; y: number } {
    if (!this._camera) throw new Error('no camera');
    if (!this._renderer?.domElement) throw new Error('no domElement');
    return d3To2(xyz, this._camera, this._renderer.domElement);
  }
  addArea() {
    window.dispatchEvent(new Event('addArea'));
  }
  clearStore() {
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
