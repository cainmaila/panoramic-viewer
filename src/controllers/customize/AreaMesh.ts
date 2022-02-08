import { DoubleSide, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import AreaGeometry from './AreaGeometry';

export default class extends Mesh {
  private _hover: boolean;
  constructor(_points: Vector3[], name?: string | undefined) {
    const _material = new MeshBasicMaterial({
      color: 0xffff00,
      side: DoubleSide,
      wireframe: true,
    });
    super(new AreaGeometry(_points), _material);
    _material.transparent = true;
    _material.opacity = 0.5;
    this.name = name || this.uuid;
    this._hover = false;
  }
  reDraw(_points: Vector3[]) {
    this.geometry = new AreaGeometry(_points);
  }
  get points(): Vector3[] {
    const _areaGeometry = <AreaGeometry>this.geometry;
    return _areaGeometry.points;
  }
  set hover(hover: boolean) {
    this._hover = hover;
    const _material = <MeshBasicMaterial>this.material;
    _material.wireframe = !this._hover;
  }
  get hover(): boolean {
    return this._hover;
  }
}
