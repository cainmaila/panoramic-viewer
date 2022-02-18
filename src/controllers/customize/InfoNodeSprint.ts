import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
import TextureLib from './TextureLib';
const material = new SpriteMaterial({});
material.sizeAttenuation = false;
class InfoNodeSprint extends Sprite {
  constructor(position: Vector3, type: string, size = 1) {
    const _size = size * 0.1;
    super(material);
    this.scale.set(_size, _size, 1);
    this.center.y = 0;
    this.position.copy(position);
    material.map = TextureLib.getTexture(type) || null;
  }
}

export default InfoNodeSprint;
