import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
import TextureLib from './TextureLib';
class InfoNodeSprint extends Sprite {
  private _iconType: string;
  private _size: number = 1;
  constructor(
    position: Vector3,
    name: string | null,
    iconType: string,
    size = 1,
  ) {
    const _size = size * 0.1;
    const material = new SpriteMaterial({});
    material.sizeAttenuation = false;
    super(material);
    this._iconType = iconType;
    this.size = size;
    this.name = name || this.uuid;
    this.center.y = 0;
    this.position.copy(position);
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
    this.scale.set(this._size * 0.1, this._size * 0.1, 1);
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
}

export default InfoNodeSprint;
