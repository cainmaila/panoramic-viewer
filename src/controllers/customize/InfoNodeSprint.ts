import { Sprite, SpriteMaterial } from 'three';
import TextureLib from './TextureLib';
const SIZE_SCALE: number = 0.1;
class InfoNodeSprint extends Sprite {
  private _iconType: string;
  private _size: number = 1;
  private _fovScale: number = 1;
  constructor(
    position: { x: number; y: number; z: number },
    name: string | null,
    iconType: string,
    size = 1,
    _fovScale = 1,
  ) {
    const _size = size * 0.1;
    const material = new SpriteMaterial({});
    material.sizeAttenuation = false;
    super(material);
    this._fovScale = _fovScale;
    this._iconType = iconType;
    this.size = size;
    this.name = name || this.uuid;
    this.center.y = 0;
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.iconType = iconType;
  }
  set iconType(type: string) {
    this._iconType = type;
    this.material.map = TextureLib.getTexture(this._iconType) || null;
  }
  get iconType(): string {
    return this._iconType;
  }
  set size(size: number) {
    this._size = size;
    this._reSize();
  }
  get size(): number {
    return this._size;
  }
  get meta(): I_InfoNodeMeta {
    return {
      id: this.name,
      iconType: this.iconType,
      iconSize: this.size,
      position: this.position,
    };
  }
  setFovScle(_scle: number = 1) {
    this._fovScale = _scle;
    this._reSize();
  }
  _reSize() {
    const _scle = this._size * this._fovScale * SIZE_SCALE;
    this.scale.set(_scle, _scle, 1);
  }
}

export default InfoNodeSprint;
