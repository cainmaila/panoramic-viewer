import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
const material = new SpriteMaterial({
  map: new TextureLoader().load('placeholder.png'),
});
material.sizeAttenuation = false;
class InfoNodeSprint extends Sprite {
  constructor(position: Vector3) {
    super(material);
    this.scale.set(0.07, 0.07, 1);
    this.center.y = 0;
    this.position.copy(position);
  }
}

export default InfoNodeSprint;
