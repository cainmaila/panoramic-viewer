import {
  BackSide,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import AreaGeometry from './AreaGeometry';
const _t = new TextureLoader().load('./cg.png');
const material = new MeshBasicMaterial({
  color: 0xffff00,
  side: BackSide,
  map: _t,
});
// material.polygonOffset = true;
// material.wireframe = true;

export default class extends Mesh {
  constructor(_points: Vector3[], name?: string | undefined) {
    super(new AreaGeometry(_points), material);
    this.name = name || this.uuid;
  }
  reDraw(_points: Vector3[]) {
    this.geometry = new AreaGeometry(_points);
  }
  get points(): Vector3[] {
    const _areaGeometry = <AreaGeometry>this.geometry;
    return _areaGeometry.points;
  }
}
