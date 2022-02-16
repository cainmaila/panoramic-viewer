import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
import TextureLib from './TextureLib';
const material = new SpriteMaterial({
  //   map: new TextureLoader().load('placeholder.png'),
});
material.sizeAttenuation = false;
class InfoNodeSprint extends Sprite {
  constructor(position: Vector3) {
    super(material);
    this.scale.set(0.07, 0.07, 1);
    this.center.y = 0;
    this.position.copy(position);
    material.map = TextureLib.getTexture('p2') || null;
  }
}

export default InfoNodeSprint;
