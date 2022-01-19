import { DoubleSide, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import AreaGeometry from './AreaGeometry';
const material = new MeshBasicMaterial({
  color: 0xffff00,
  side: DoubleSide,
});
material.wireframe = true;

export default class extends Mesh {
  constructor(_points: Vector3[]) {
    super(new AreaGeometry(_points), material);
  }
  reDraw(_points: Vector3[]) {
    this.geometry = new AreaGeometry(_points);
  }
}
