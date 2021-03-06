import { PolyhedronGeometry, Vector3 } from 'three';
const indicesOfFaces = [0, 1, 2, 0, 2, 3];
export default class extends PolyhedronGeometry {
  private _points: Vector3[];
  constructor(_points: Vector3[], redius: number = 400) {
    const verticesOfCube: number[] = [];
    _points.forEach((_po) => {
      verticesOfCube.push(_po.x);
      verticesOfCube.push(_po.y);
      verticesOfCube.push(_po.z);
    });
    super(verticesOfCube, indicesOfFaces, redius, 0);
    this._points = _points;
  }
  get points() {
    return this._points;
  }
}
